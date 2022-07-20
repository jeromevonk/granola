import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import ExpenseForm from '../components/ExpenseForm';

export default function Index() {

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1" sx={{ mt: 4 }}>
        New expense
      </Typography>
      <ExpenseForm />
    </Container>
  );
}
