import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import YearPicker from '../components/YearPicker';
import { AppContext } from 'src/pages/_app';
import { getCustomMonthInitials } from 'src/helpers'

export default function MonthSelector(props) {
  const { handleChange, year, month } = props;

  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;

  // Custom padding
  const padding = { padding: { xs: '7px 4px', md: '7px 20px' } };
  return (

    <Stack spacing={2} direction={largeScreen.width ? 'row' : 'column'} alignItems="center">
      <Stack sx={{ width: '200px' }}>
        <YearPicker
          handleChange={handleChange}
          year={year}
        />
      </Stack>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > :not(style) + :not(style)': { mb: 2 },
        }}
      >
        <ToggleButtonGroup
          color="primary"
          exclusive
          onChange={(_event, value) => { handleChange('month', value) }}
        >
          {
            // ------------------------------------------
            // Create 12 buttons representing months
            // ------------------------------------------
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(monthId => {
              return (
                <ToggleButton
                  key={monthId}
                  value={monthId}
                  size="small" sx={padding}
                  selected={monthId === month}
                >
                  {getCustomMonthInitials(monthId, largeScreen.width)}
                </ToggleButton>)
            })
          }

        </ToggleButtonGroup>
      </Grid>
    </Stack>
  );
}

MonthSelector.propTypes = {
  handleChange: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
};