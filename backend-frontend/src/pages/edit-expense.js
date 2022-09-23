import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { withRouter } from 'next/router'
import ExpenseForm from '../components/ExpenseForm';

function EditExpense(props) {
  const {id, ...expense} = props.router.query;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1" sx={{ mt: 4 }}>
        Edit expense
      </Typography>
      <ExpenseForm 
        expense={expense} 
        action="edit" 
        expenseId={Number(id)}
      />
    </Container>
  );
}

export default withRouter(EditExpense)