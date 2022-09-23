import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import ReportTable from '../components/ReportTable';
import { statsService, alertService } from 'src/services';
import YearPicker from '../components/YearPicker';
import CategorySelector from '../components/CategorySelector';
import { AppContext } from 'src/pages/_app';
import { getCategoryTitles, sortTitleAlphabetically } from 'src/helpers'

export default function Report() {
  // Context
  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;
  const categories = context?.categories.all;

  // ------------------------------------------
  // States
  // ------------------------------------------
  const [selectedOptions, setSelectedOptions] = React.useState({
    year: new Date().getFullYear(),
    type: 'mainCategory'
  });

  // 'reportData' is an object which holds data for every (year, type) the user picks. 
  const [reportData, setReportData] = React.useState({});
  const [mainCategories, setMainCategories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (name, value) => {
    setSelectedOptions(prev => {
      const newState = {
        ...prev,
        [name]: value
      }

      if (name === 'year') {
        newState.type = 'mainCategory';
      }

      return newState;
    })
  };

  const makeTitle = ({ year, type }) => {

    if (type === 'mainCategory') {
      return `Sum of expenses by category in ${year}`;
    }
    else if (type === 'subCategory') {
      return `Sum of expenses by sub-category in ${year}`;
    }
    else {
      return <span>Sum of expenses by sub-category of <i>{getCategoryTitles(categories, Number(type)).categoryTitle}</i> in {year}</span>;
    }

  }

  // -----------------------------------------------
  // Auxiliar functions for managing state
  // -----------------------------------------------
  const hasData = (year, type, dataObj) => {
    return dataObj[year] && dataObj[year][type];
  }

  const addDataToState = (year, type, values, numMonths) => {
    setReportData(prev => ({
      // Copy data from all years
      ...prev,

      // Data for the selected year is what we are changing
      [year]: {
        // Copy data from all years
        ...prev[year],

        // Data for the selected type is what we are changing
        [type]: {
          values,
          numMonths
        }
      }
    }));
  }

  const getSelectedData = ({ year, type }, data) => {
    if (hasData(year, type, data)) {
      return data[year][type];
    } else {
      return {}
    }
  }

  const groupByCategory = (data, categoryList) => {
    const grouped = {};

    // How many months do we need to display as columns?
    const numMonths = data.reduce((previous, current) => Math.max(previous, current.month), 0);

    // There's data for several months. First, group by category
    for (const entry of data) {
      if (!(entry.category in grouped)) grouped[entry.category] = {}
      grouped[entry.category][entry.month] = entry.amountSpent;
    }

    // Now, convert to an array
    const year = [];

    // For every category
    for (let [key, value] of Object.entries(grouped)) {
      const entry = {
        category: Number(key),
        categoryText: getCategoryTitles(categoryList, Number(key)).categoryTitle
      };

      // Get the amount for every month (and sum)
      let sum = 0;
      for (let i = 1; i <= numMonths; i++) {
        let spent = value[i] || "0.00";
        entry[i] = spent;
        sum += Number(spent);
      }
      // Add YTD sum
      entry.year = sum.toFixed(2);

      // Push to resulting array
      year.push(entry);
    }

    return { grouped: year, numMonths };
  }

  // ------------------------------------
  // Get data via API
  // ------------------------------------
  React.useEffect(() => {

    // Only make the call if there is not data already in state
    if (hasData(selectedOptions.year, selectedOptions.type, reportData)) return;

    // If we do not have the categories yet, do not bother getting the data
    if (categories.length === 0) return;

    // Set flags
    let isSubscribed = true;
    setIsLoading(true);

    statsService.getCategoryReportByYear(selectedOptions.year, selectedOptions.year, selectedOptions.type)
      .then(data => {
        if (isSubscribed) {
          // Group data and add to state
          const { grouped, numMonths } = groupByCategory(data, categories);
          addDataToState(selectedOptions.year, selectedOptions.type, grouped, numMonths);

          // --------------------------------------------------------------------------
          // There might have been a year change, so if it's type == 'mainCategory',
          // get the categories with non-zero sum
          // --------------------------------------------------------------------------
          if (selectedOptions.type === 'mainCategory') {
            let availableCategories = grouped
              .reduce((prev, current) => {
                const id = current.category;
                const title = getCategoryTitles(categories, id).categoryTitle;

                if (!prev.find(item => item.id === id)) {
                  // Add current to array
                  prev.push({ id, title })
                }

                return prev;
              }, []);

            // Sort and set state
            availableCategories.sort(sortTitleAlphabetically);
            setMainCategories(availableCategories);
          }
          setIsLoading(false);
        }
      })
      .catch(err => alertService.error(`API error: ${err}`));
    return () => {
      isSubscribed = false;
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions, categories]);


  // Enough space in screen?
  if (!largeScreen.width) {
    return (
      <Container maxWidth="xl">
        <Typography component="h1" variant="h5">
          <Box sx={{ my: 2 }}>
            {"Sorry, this page can't be viewed on smaller screens 😬"}
          </Box>
        </Typography>

      </Container>
    );
  }

  // Prepare props for ReportTable component
  const tableTitle = makeTitle(selectedOptions);
  const selectedData = getSelectedData(selectedOptions, reportData);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 2 }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={10} alignItems="center" justifyContent="flex-start">
            <YearPicker
              handleChange={handleChange}
              year={selectedOptions.year}
            />
            <CategorySelector
              handleChange={handleChange}
              mainCategories={mainCategories}
              radio={selectedOptions.type}
            />
          </Stack>
          {
            // If loading, show 'progress'
            isLoading ?
              (
                <LinearProgress color="primary" />

              ) :
              (
                <ReportTable
                  title={tableTitle}
                  data={selectedData.values || []}
                  numMonths={selectedData.numMonths || 0}
                />
              )
          }

        </Stack>
      </Box>
    </Container>
  );
}
