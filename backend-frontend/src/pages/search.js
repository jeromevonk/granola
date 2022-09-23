import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { useRouter, withRouter } from 'next/router'
import ExpensesTable from '../components/ExpensesTable';
import { expenseService, alertService } from 'src/services';
import { getCategoryTitles } from 'src/helpers'
import { AppContext } from 'src/pages/_app';

function Search(props) {
  const { query } = props.router.query;

  // Context
  const context = React.useContext(AppContext);
  const categories = context?.categories.all;

  // Router
  const router = useRouter();

  // -------------------------------------------------------
  // In this page, 'expenses' state is an array of expenses
  // -------------------------------------------------------
  const [expenses, setExpenses] = React.useState({ query: false, result: [] });
  const [isLoading, setIsLoading] = React.useState(false);

  const findExpense = (target) => {
    return expenses.result.find(item => item.id === target);
  }

  // -------------------------------------------
  // Custom formatDate
  // It's basically YYYY-MM-DD
  // with XX on the end if the day is null
  // -------------------------------------------
  const formatDate = (year, month, day) => {
    let formatted = `${year}-`;

    if (month < 10) formatted += '0';
    formatted += `${month}-`;

    if (day !== null) {
      if (day < 10) formatted += '0';
      formatted += `${day}`;
    } else {
      formatted += 'XX';
    }

    return formatted;
  }

  // -------------------------------------------
  // Handler
  // -------------------------------------------
  const handleAction = (action, selected) => {
    if (action === 'delete') {
      expenseService.deleteExpenses(selected)
        .then((response) => {
          setExpenses(prev => ({
            ...prev,
            result: prev.result.filter(item => !response.deleted.includes(item.id))
          }));

          return response;
        })
        .then((response) => {
          alertService.success(`${response.deleted.length} expense(s) deleted, ${response.failed.length} failed`);
        });
    } else if (action === 'edit' || action === 'duplicate') {
      // Find expense (there should be only 1 selected, so use first position of the list)
      const exp = findExpense(selected[0]);

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
    }
  }

  // -----------------------------------------------------
  // Get expenses via API
  // -----------------------------------------------------
  React.useEffect(() => {
    // Dot not proceed if query is undefined
    if (!query) return;

    // Dot not proceed if we already have that query saved on state
    if (expenses.query === query) return;

    // If we do not have the categories yet, do not bother getting the data
    if (categories.length === 0) return;

    // Set flags
    let isSubscribed = true;
    setIsLoading(true);

    // Make request
    expenseService.searchExpenses(query)
      .then(expenseList => {
        if (isSubscribed) {
          setExpenses({
            query,
            result: expenseList.map(expense => {
              // Category titles
              const cat = getCategoryTitles(categories, expense.category);

              return {
                id: expense.id,
                day: expense.day,
                date: formatDate(expense.year, expense.month, expense.day),
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
              }
            })
          });
        }
        setIsLoading(false);
      })
      .catch(err => alertService.error(`API error: ${err}`));
    return () => {
      isSubscribed = false;
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Box sx={{ my: 2 }}>
        <Stack spacing={1}>
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
                  title={`Search results for: ${expenses.query}`}
                  expenses={expenses.result}
                />
              )
          }
        </Stack>
      </Box>
    </Container>
  );
}

export default withRouter(Search)