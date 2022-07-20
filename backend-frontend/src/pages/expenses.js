import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpensesTable from '../components/ExpensesTable';

export default function Expenses() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Expenses
        </Typography>
        <ExpensesTable month="2022-06"/>
      </Box>
    </Container>
  );
}
