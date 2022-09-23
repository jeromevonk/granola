import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CategoryList from '../components/CategoryList';

export default function Categories() {

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1" sx={{ mt: 4 }}>
        Categories
      </Typography>
      <CategoryList />
    </Container>
  );
}