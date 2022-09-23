import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { withRouter } from 'next/router'
import ExpenseForm from '../components/ExpenseForm';

function NewExpense(props) {
  const { id, ...expense } = props.router.query;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1" sx={{ mt: 4 }}>
        New expense
      </Typography>
      <ExpenseForm
        expense={expense}
        action="create"
      />
    </Container>
  );
}

export default withRouter(NewExpense)
