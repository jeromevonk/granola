import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../components/Link';
import EnhancedTable from '../components/EnhancedTable';

export default function Stats() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stats
        </Typography>
      </Box>
    </Container>
  );
}
