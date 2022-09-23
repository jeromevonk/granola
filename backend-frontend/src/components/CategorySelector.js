import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

export default function CategorySelector(props) {
  const { handleChange, mainCategories, radio } = props;
  const [category, setCategory] = React.useState(mainCategories[0] ? mainCategories[0].id : '');

  // If the selected category is no longer supplied in the mainCategories array,
  // clear the selection
  if (mainCategories.length > 0 &&
    category !== '' &&
    !mainCategories.find(cat => cat.id === category)) {
    setCategory('');
  }

  return (
    <Stack direction='row' sx={{ alignItems: "center" }}>
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="category-radio-buttons-group-label"
          name="category-radio-buttons-group"
          onChange={
            (event) => {
              // Set state
              const { value } = event.target;

              // If it's main categories or sub-categories, simply call the handler
              // with value from the Radio button
              if (value !== 'detailed') {
                handleChange('type', value);
              } else {
                // If it's 'detailed', call the handler with selected category
                if (category !== '') {
                  handleChange('type', category.toString());
                }
              }
            }
          }
        >
          <FormControlLabel value="mainCategory" control={<Radio checked={radio === 'mainCategory'} />} label="Main categories" />
          <FormControlLabel value="subCategory" control={<Radio checked={radio === 'subCategory'} />} label="Sub-categories" />
          <FormControlLabel value="detailed" control={<Radio checked={!['mainCategory', 'subCategory'].includes(radio)} />} label="One category detailed:" />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="select-category-label"
          id="select-category"
          label="Category"
          value={category}
          sx={{ minWidth: 120 }}
          onChange={(event => {
            // Set category to event target and radio to 'detailed' 
            const { value } = event.target;
            setCategory(value);

            // Call handler with value from Select
            handleChange('type', value.toString());
          })}
        >
          { // Get the main categories
            mainCategories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Stack>
  );
}

CategorySelector.propTypes = {
  handleChange: PropTypes.func.isRequired,
  mainCategories: PropTypes.array.isRequired,
  radio: PropTypes.string.isRequired,
};