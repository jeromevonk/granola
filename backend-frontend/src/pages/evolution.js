import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useRouter } from 'next/router'
import EvolutionChart from '../components/EvolutionChart';
import EvolutionSelector from '../components/EvolutionSelector';
import { statsService, alertService } from 'src/services';
import { AppContext } from 'src/pages/_app';
import { getCategoryTitles, getParentCategoryId, capitalizeFirstLetter, manipulateData, parseDate } from 'src/helpers'

export default function Evolution() {
  // Context
  const context = React.useContext(AppContext);
  const categories = context?.categories.all;

  // Router
  const router = useRouter();

  // States
  const [rawData, setRawData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState({
    hideEmptyMonths: false,
    evolutionDateType: 'year',
    evolutionCategory: {
      type: 'all',
      number: 0
    }
  });

  const handleChange = (name, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [name]: value
    }))
  };

  // -----------------------------------------------
  // Auxiliar functions for managing state
  // -----------------------------------------------
  const hasData = (dateType, categoryKey, dataObj) => {
    return dataObj[dateType] && dataObj[dateType][categoryKey];
  }

  const addDataToState = (dateType, categoryType, categoryNumber, data) => {
    const categoryKey = getCategoryKey(categoryType, categoryNumber);
    setRawData(prev => ({
      // Copy data from all types
      ...prev,

      // Data for the selected type is what we are changing
      [dateType]: {
        // Copy data from all categories
        ...prev[dateType],

        // Data for the selected category is what we are changing
        [categoryKey]: data
      }
    }));
  }

  const getSelectedData = (options, data) => {
    const dateType = options.evolutionDateType;
    const { type: categoryType, number: categoryNumber } = options.evolutionCategory;
    const categoryKey = getCategoryKey(categoryType, categoryNumber);

    if (hasData(dateType, categoryKey, data)) {
      return data[dateType][categoryKey];
    } else {
      return [];
    }
  }

  const getCategoryKey = (categoryType, categoryNumber) => {
    return `${categoryType}-${categoryNumber}`;
  }

  // -----------------------------------------------
  // Make the chart title
  // -----------------------------------------------
  const makeTitle = ({ evolutionDateType, evolutionCategory }) => {
    // Hacky way of getting the title
    let title = `${capitalizeFirstLetter(evolutionDateType)}ly evolution of expenses for `;

    const { type: categoryType, number: categoryNumber } = evolutionCategory;

    // Type
    if (categoryType === 'all') title += 'all categories';
    if (categoryType === 'mainCategory') title += `main category: ${getCategoryTitles(categories, categoryNumber).categoryTitle}`;
    if (categoryType === 'subCategory') title += `sub-category: ${getCategoryTitles(categories, categoryNumber).categoryTitle}`;

    return title;
  }

  // ------------------------------------
  // Get data via API
  // ------------------------------------
  React.useEffect(() => {

    const dateType = selectedOptions.evolutionDateType;
    const { type: categoryType, number: categoryNumber } = selectedOptions.evolutionCategory;
    const categoryKey = getCategoryKey(categoryType, categoryNumber);

    // Only make the call if there is not data already in state
    if (hasData(dateType, categoryKey, rawData)) return;

    // ---------------------------------------------------------
    // Figure out witch request should be made and its params
    // ---------------------------------------------------------
    let request;

    if (dateType === 'year') {
      request = statsService.getEvolutionPerYear;
    } else {
      request = statsService.getEvolutionPerMonth;
    }

    const params = {};
    if (categoryType === 'all') {
      // Nothing to do
    } else if (categoryType === 'mainCategory') {
      params.mainCategory = categoryNumber;
    } else if (categoryType === 'subCategory') {
      params.subCategory = categoryNumber;
    }

    // Set flags
    let isSubscribed = true;
    setIsLoading(true);

    // Make request
    request(params)
      .then((response) => {
        if (isSubscribed) {
          addDataToState(dateType, categoryType, categoryNumber, response)
        }
        setIsLoading(false);
      })
      .catch(err => alertService.error(`API error: ${err}`));

    return () => {
      isSubscribed = false;
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions.evolutionDateType, selectedOptions.evolutionCategory]);

  // Callback function for chart events
  const eventCallback = (selected, evolutionCategory) => {
    const row = selected.row + 1; // we have to consider that first row is the header
    const column = 0; // date is always column 0

    // Parse date
    const dateString = chartData[row][column];
    const { year, month } = parseDate(dateString)

    if (!month) {
      // Set type to 'month', so user can click a specific month on chart
      setSelectedOptions(prev => ({
        ...prev,
        evolutionDateType: 'month'
      }))
    } else {
      // Navigate to expenses page, passing year and month
      const query = {
        year,
        month
      };

      // Add other needed parameters
      if (evolutionCategory.type === 'mainCategory') {
        query.mainCategory = evolutionCategory.number
      } else if (evolutionCategory.type === 'subCategory') {
        query.mainCategory = getParentCategoryId(categories, evolutionCategory.number);
        query.subCategory = evolutionCategory.number;
      }

      router.push({
        pathname: '/',
        query
      }, '/');
    }
  }

  // Prepare the data according to user selection of hideEmptyMonths
  const selectedData = getSelectedData(selectedOptions, rawData);
  const chartData = manipulateData(selectedOptions, selectedData);

  // Get chart title
  const chartTitle = makeTitle(selectedOptions);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 1 }}>
        <EvolutionSelector
          handleChange={handleChange}
          hideEmptyMonths={selectedOptions.hideEmptyMonths}
          evolutionDateType={selectedOptions.evolutionDateType}
          categoryType={selectedOptions.evolutionCategory.type}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        {
          // If loading, show 'progress'
          isLoading ?
            (
              <Container maxWidth="lg">
                <LinearProgress color="primary" />
              </Container>
            ) :
            (
              <EvolutionChart
                data={chartData}
                options={{
                  title: chartTitle,
                  vAxis: { minValue: 0 },
                  legend: { position: "none" },
                  colors: ['008080']
                }}
                eventCallback={eventCallback}
                evolutionCategory={selectedOptions.evolutionCategory}
              />
            )
        }
      </Box>
    </Container>
  );
}