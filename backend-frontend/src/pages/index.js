import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'src/components/Link';
import BasicSpeedDial from 'src/components/BasicSpeedDial';

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Home page
        </Typography>
        <Link href="/expenses" color="secondary">
          Go to the expenses page
        </Link>
        <BasicSpeedDial />
      </Box>
    </Container>
  );
}
