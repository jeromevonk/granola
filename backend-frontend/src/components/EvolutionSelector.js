import * as React from 'react';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { getSubCategories, sortTitleAlphabetically } from 'src/helpers'
import { AppContext } from 'src/pages/_app';

export default function EvolutionSelector(props) {
  const { handleChange, hideEmptyMonths, evolutionDateType, categoryType } = props;

  // Context
  const context = React.useContext(AppContext);
  const categories = context?.categories.all;

  // States for selects
  const [mainCategory, setMainCategory] = React.useState('');
  const [subCategory, setSubCategory] = React.useState('');

  // Categories and sub-categories
  const mainCategories = context?.categories.mainCategories
  const subCategories = getSubCategories(categories, mainCategory).sort(sortTitleAlphabetically);

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-around"
      sx={{
        marginTop: 3
      }}
    >
      {
        // ------------------------
        // Year or Month?
        // ------------------------
      }
      <Stack spacing={0} alignItems="center" justifyContent="space-around">
        <FormControl>
          <FormLabel id="evolutionDateType-formlabel">Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="evolutionDateType-label"
            name="evolutionDateType"
            onChange={
              (event) => {
                // Set state
                const { value } = event.target;
                handleChange('evolutionDateType', value);
              }
            }
          >
            <FormControlLabel value="year" control={<Radio checked={evolutionDateType === 'year'} />} label="Year" />
            <FormControlLabel value="month" control={<Radio checked={evolutionDateType === 'month'} />} label="Month" />
          </RadioGroup>
        </FormControl>
        <ToggleButtonGroup
          color="primary"
          value={hideEmptyMonths}
          exclusive
          onChange={(_event, value) => {
            handleChange('hideEmptyMonths', value);
          }}
        >
          <ToggleButton
            key='toggle-button-hide'
            value={true}
            size="small"
          >Hide empty
          </ToggleButton>
          <ToggleButton
            key='toggle-button-show'
            value={false}
            size="small"
          >Show all
          </ToggleButton>

        </ToggleButtonGroup>
      </Stack>
      {
        // ----------------------------------------------------
        // All categories, 1 main category or 1 sub-category?
        // ----------------------------------------------------
      }
      <FormControl>
        <Box sx={{ marginBottom: 1 }}>
          <FormLabel id="evolution-category-formlabel">Category</FormLabel>
          <RadioGroup
            row
            aria-labelledby="evolution-category-label"
            name="evolutionCategoryType"
            onChange={
              (event) => {
                // Set state
                const { value } = event.target;

                // If it's 'all categories', simply call the handler
                if (value === 'all') {
                  handleChange('evolutionCategory', {
                    type: value,
                    number: 0
                  });
                } else if (value === 'mainCategory') {
                  // If it's 'main category', call the handler with selected mainCategory
                  if (mainCategory !== '') {
                    handleChange('evolutionCategory', {
                      type: value,
                      number: mainCategory
                    });
                  }
                } else if (value === 'subCategory') {
                  // If it's 'sub-category', call the handler with selected subCategory
                  if (subCategory !== '') {
                    handleChange('evolutionCategory', {
                      type: value,
                      number: subCategory
                    });
                  }
                }
              }
            }
          >
            <FormControlLabel value="all" control={<Radio checked={categoryType === 'all'} />} label="All categories" />
            <FormControlLabel value="mainCategory" control={<Radio checked={categoryType === 'mainCategory'} />} label="Main category" />
            <FormControlLabel value="subCategory" control={<Radio checked={categoryType === 'subCategory'} />} label="Sub-category" />
          </RadioGroup>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
          <FormControl variant="standard" sx={{ minWidth: '50%' }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="select-category-label"
              id="select-category"
              label="Category"
              value={mainCategory}
              onChange={(event => {
                // Update states
                const { value } = event.target;
                setMainCategory(value);
                setSubCategory(''); // need to reset subCategory, since options have changed

                // Call handler
                handleChange('evolutionCategory', {
                  type: 'mainCategory',
                  number: value
                });
              })}
            >
              { // Get the main categories
                mainCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ minWidth: '50%' }}>
            <InputLabel id="category-select-label">Sub-category</InputLabel>
            <Select
              labelId="select-sub-category-label"
              id="select-sub-category"
              label="Sub-category"
              value={subCategory}
              onChange={(event => {
                // Update states
                const { value } = event.target;
                setSubCategory(value);

                // Call handler
                handleChange('evolutionCategory', {
                  type: 'subCategory',
                  number: value
                });
              })}
            >
              { // Get the main categories
                subCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Stack>
      </FormControl>
    </Stack>
  );
}

EvolutionSelector.propTypes = {
  handleChange: PropTypes.func.isRequired,
  hideEmptyMonths: PropTypes.bool.isRequired,
  evolutionDateType: PropTypes.string.isRequired,
  categoryType: PropTypes.string.isRequired,
};
