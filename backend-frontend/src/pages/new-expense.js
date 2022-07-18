import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';

import { useForm } from 'react-hook-form';

import { categoryService, expenseService } from 'src/services';

export default function Index() {

  // get functions to build form with useForm() hook
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    const parsedDate = data.date.split("-");

    const expense = {
      year: Number(parsedDate[0]),
      month: Number(parsedDate[1]),
      day: data.ignoreDay ? null : Number(parsedDate[2]),
      description: data.description,
      details: data.details,
      amountPaid: Number(data.amountPaid),
      amountReimbursed: Number(data.amountReimbursed),
      category: Number(data.subCategory),
      recurring: true
    };
    
    return expenseService.createNewExpense(expense)
      .then((res) => {
        console.log(res);
      })
  }

  // States
  const [selectedMainCat, setMainCategory] = React.useState(1);
  const [selectedSubCat, setSubCategory] = React.useState(22);
  const [categories, setCategories] = React.useState([]);

  // Effects
  React.useEffect(() => {
    categoryService.getCategories().then(x => setCategories(x));
  }, []);

  const getMainCategories = () => {
    const mainCategories = []
    for (const item of categories) {
      if (item.parentId === null) {
        mainCategories.push({
          name: item.title,
          id: item.id
        });
      }
    }

    console.log(`Found ${mainCategories.length} main categories`);
    return mainCategories;
  }

  const getSubCategories = (mainCategoryId) => {
    const subCategories = [];

    for (const item of categories) {
      if (item.parentId === mainCategoryId) {
        subCategories.push({
          name: item.title,
          id: item.id
        });
      }
    }

    console.log(`Found ${subCategories.length} sub categories for main category id=${mainCategoryId}`);
    return subCategories;
  }

  const handleChange = (event) => {
    const {name, value} = event.target;
    console.log(name, value)

    switch (name) {
    case 'category': 
      setMainCategory(value); 
      break;

    case 'subcategory': 
      setSubCategory(value);
      break;

    default:
      break;
    }
  };


  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          New expense
        </Typography>
        <Divider sx={{ marginBottom: 2}}/>
        <Stack>
          {
            /* 
            // ----------------------------------------
            // Date
            // ----------------------------------------
            */
          }
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
            <TextField
              id="date"
              label="Date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              sx={{ width: 180 }}
              InputLabelProps={{
                shrink: true,
              }}
              {...register('date')}
            />
            <FormGroup>
              <FormControlLabel control={<Checkbox {...register('ignoreDay')}/>} label="Ignore day" />
            </FormGroup>
          </Stack>
          <Divider sx={{ mb: 1, mt: 1}}/>
          {
            /* 
            // ----------------------------------------
            // Description and details
            // ----------------------------------------
            */
          }
          <Box>
            <TextField
              margin="normal"
              required
              id="description"
              label="Description"
              defaultValue=""
              {...register('description')}
            />
            <Divider sx={{ mb: 1, mt: 1}}/>
            <TextField
              margin="normal"
              required
              id="details"
              label="Details"
              defaultValue=""
              {...register('details')}
            />
          </Box>
          <Divider sx={{ mb: 1, mt: 1}}/>
          {
            /* 
            // ----------------------------------------
            // Amount paid and reimbursed
            // ----------------------------------------
            */
          }
          <Stack direction="row" spacing={2} alignItems="baseline" justifyContent="flex-start">
            <TextField
              margin="normal"
              required
              id="amountPaid"
              label="Amount paid"
              defaultValue="" 
              inputProps={{ inputMode: 'numeric' }}
              {...register('amountPaid')}
            />
            <TextField
              margin="normal"
              id="amountReimbursed"
              label="Amount Reimbursed"
              defaultValue=""
              inputProps={{ inputMode: 'numeric' }}
              {...register('amountReimbursed')}
            />
          </Stack>
          <Divider sx={{ mb: 1, mt: 1}}/>
          {
            /* 
            // ----------------------------------------
            // Category
            // ----------------------------------------
            */
          }
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
            <FormControl variant="standard" sx={{ m: 1, minWidth: '40%' }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                label="Category"
                value={selectedMainCat}
                onChange={handleChange}
              >
                { // Get the main categories
                  getMainCategories().map( (category) => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: '50%' }}>
              <InputLabel id="subcategory-select-label">Sub-category</InputLabel>
              <Select
                labelId="subCategory-label"
                id="subCategory"
                name="subCategory"
                label="Sub-category"
                value={selectedSubCat}
                {...register('subCategory')}
                onChange={handleChange}
              >
                { // Get the sub categories for selected main category
                  getSubCategories(selectedMainCat).map( (category) => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Stack>
          {
            /* 
            // ----------------------------------------
            // Recurring  
            // ----------------------------------------
            */
          }
          <FormGroup sx={{ mt: 0, mb: 2 }}>
            <FormControlLabel control={<Checkbox {...register('recurring')}/>} label="Recurring" />
          </FormGroup>
        </Stack>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create
        </Button>
      </Box>
    </Container>
  );
}
