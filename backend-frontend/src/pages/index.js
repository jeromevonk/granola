import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { useRouter, withRouter } from 'next/router'
import ExpensesTable from '../components/ExpensesTable';
import MonthSelector from '../components/MonthSelector';
import { expenseService, alertService } from 'src/services';
import { getCustomDateString, getCategoryTitles } from 'src/helpers'
import { AppContext } from 'src/pages/_app';

function Index(props) {
  // Context
  const context = React.useContext(AppContext);
  const categories = context?.categories.all;
  const largeScreen = context?.largeScreen;

  // Router
  const router = useRouter();

  // Initial state is either what was passed via query
  // or current year and month
  const [selectedDate, setSelectedDate] = React.useState({
    year: Number(props.router.query.year) || new Date().getFullYear(),
    month: Number(props.router.query.month) || new Date().getMonth() + 1 // to get current month
  });

  // Initial filter
  const initialFilter = {
    mainCategory: props.router.query.mainCategory,
    subCategory: props.router.query.subCategory
  };

  // -------------------------------------------------------
  // 'expenses' state is an object which holds
  // data for every year the users picks. 
  // Expenses are grouped by year and month.
  // Every month is an array of expenses
  // -------------------------------------------------------
  const [expenses, setExpenses] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const groupByMonth = (expenseList, categoryList) => {
    const year = {}
    for (const expense of expenseList) {
      if (!(expense.month in year)) year[expense.month] = []

      // Category titles
      const cat = getCategoryTitles(categoryList, expense.category);

      year[expense.month].push({
        id: expense.id,
        day: expense.day,
        date: expense.day,
        description: expense.description,
        details: expense.details,
        category: expense.category,
        categoryText: `${cat.parentCategoryTitle}: ${cat.categoryTitle}`,
        mainCategoryText: cat.parentCategoryTitle,
        subCategoryText: cat.categoryTitle,
        amountPaid: expense.amountPaid,
        amountReimbursed: expense.amountReimbursed,
        spent: (expense.amountPaid - expense.amountReimbursed).toFixed(2),
        recurring: expense.recurring,
      })
    }
    return year;
  }

  const handleChange = (name, value) => {
    setSelectedDate(prev => ({
      ...prev,
      [name]: value
    }))
  };

  const findExpense = (target, year, month) => {
    return expenses[year][month].find(item => item.id === target);
  }

  // -------------------------------------------
  // Handler
  // -------------------------------------------
  const handleAction = (action, selected, options = {}) => {
    if (action === 'delete') {
      expenseService.deleteExpenses(selected)
        .then((response) => {
          setExpenses(
            prev => {
              // Narrow the search by providing year and month
              // Filter the ones not deleted
              const newArray = prev[selectedDate.year][selectedDate.month].filter(item => !response.deleted.includes(item.id));
              prev[selectedDate.year][selectedDate.month] = newArray;

              return {
                ...prev
              };
            }
          );
          return response;
        })
        .then((response) => {
          alertService.success(`${response.deleted.length} expense(s) deleted, ${response.failed.length} failed`);
        })
        .catch(err => alertService.error(`API error: ${err}`));
    } else if (action === 'edit' || action === 'duplicate') {
      // Find expense
      const exp = findExpense(selected[0], selectedDate.year, selectedDate.month);

      // Add month and year
      exp.year = selectedDate.year;
      exp.month = selectedDate.month;

      if (action === 'duplicate') {
        // Push to new expense page with expense data
        router.push({
          pathname: '/new-expense',
          query: exp,
        }, '/new-expense');
      } else {
        router.push({
          pathname: '/edit-expense',
          query: exp,
        }, '/edit-expense');
      }
    } else if (action === 'copy') {
      expenseService.copyRecurringToNextMonth(selectedDate.year, selectedDate.month, options.keepAmounts)
        .then((response) => {

          if (response.length === 0) {
            alertService.error('Nothing was copied');
            return;
          }

          // Recurring expenses will be copied to "next month": figure out the target year and month
          const targetYear = response[0].year
          const targetMonth = response[0].month

          // Group and format new data
          const groupedMonth = groupByMonth(response, categories);
          const toAdd = groupedMonth[targetMonth];

          if (!expenses[targetYear]) {
            // No data for target year.
            // It might be because there are no expenses (which would be ok)
            // or because they haven't been fetched yet (so we can't concat).
            // Also, it might be the case of a year change
            // and the next year might not be showing in the year picker.
            // A hack to fix this is to reload the whole page and let the
            // user and effects do their job.
            router.reload(window.location.pathname);

            return;
          }

          // Add to state
          setExpenses(prev => {
            // Get data for target year
            const yearData = prev[targetYear];

            // Concat data
            const monthData = yearData[targetMonth] || [];
            yearData[targetMonth] = [...monthData, ...toAdd];

            return {
              ...prev,
              [targetYear]: yearData
            }
          })
        })
        .then(() => {
          alertService.success('Copied');
        })
        .catch(err => alertService.error(`API error: ${err}`));
    }
  }

  // -----------------------------------------------------
  // Get expenses via API
  // only fetch data for the selected year if there is
  // no prior data
  // -----------------------------------------------------
  React.useEffect(() => {
    // If there's already data, return early
    if (selectedDate.year in expenses) return;

    // If we do not have the categories yet, do not bother getting the data
    if (categories.length === 0) return;

    // Set flags
    let isSubscribed = true;
    setIsLoading(true);

    // Make request
    expenseService.getExpenses(selectedDate.year)
      .then(expenseList => {
        if (isSubscribed) {
          setExpenses(prev => ({
            ...prev,
            [selectedDate.year]: groupByMonth(expenseList, categories)
          }))
        }
        setIsLoading(false);
      })
      .catch(err => alertService.error(`API error: ${err}`));
    return () => {
      isSubscribed = false;
      setIsLoading(false);
    }
    // We do not want to include expenses as a dependency here, so
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate.year, categories]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 2 }}>
        <Stack spacing={1}>
          <MonthSelector
            handleChange={handleChange}
            year={selectedDate.year}
            month={selectedDate.month}
          />
          {
            // If loading, show 'progress'
            isLoading ?
              (
                <Box>
                  <LinearProgress color="primary" />
                </Box>
              ) :
              (
                <ExpensesTable
                  handleAction={handleAction}
                  title={getCustomDateString(selectedDate.year, selectedDate.month, largeScreen.width)}
                  expenses={expenses[selectedDate.year] && expenses[selectedDate.year][selectedDate.month]}
                  filter={initialFilter}
                />
              )
          }
        </Stack>
      </Box>
    </Container>
  );
}

export default withRouter(Index)
