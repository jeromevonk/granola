import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getYear, parse } from 'date-fns'
import { expenseService } from 'src/services'

export default function YearPicker(props) {
  const { handleChange, year } = props;
  const [years, setYears] = React.useState({
    min: 2012,
    max: new Date().getFullYear()
  });

  React.useEffect(() => {
    expenseService.getYears()
      .then((data) => {
        if (data.length > 0) {
          setYears({
            min: data[0],
            max: data[data.length - 1]
          })
        }
      });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={['year']}
        label="Year"
        value={new Date(year, 0)}
        sx={{ width: 1 }}
        minDate={parse(years.min, 'yyyy', new Date())}
        maxDate={parse(years.max, 'yyyy', new Date())}
        onChange={(newValue) => {
          handleChange('year', getYear(newValue));
        }}
        renderInput={(params) => <TextField {...params} onKeyDown={e => e.preventDefault()} />}
      />
    </LocalizationProvider>
  );
}

YearPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
};