import * as React from 'react';
import Container from '@mui/material/Container';
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
import { useRouter } from 'next/router'

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

import { categoryService, expenseService, alertService } from 'src/services';

export default function ExpenseForm() {

  // -----------------------------------
  // Form validation rules 
  // -----------------------------------
  const validationSchema = Yup.object().shape({
    date: Yup.date()
      .required('Date is required')
      .min('2012-01-01', 'Must be after 2012'),
    description: Yup.string()
      .required('Description is required')
      .max(70, 'Maximum 70 characters')
      .min(3, 'Minimum 3 characters'),
    details: Yup.string()
      .max(70, 'Maximum 70 characters'),
    amountPaid: Yup.number()
      .required('Amount paid is required')
      .min(0, 'Must be >= 0')
      .max(99999, 'Must be < 100.000'),
    amountReimbursed: Yup.number()
      .min(0, 'Must be >= 0')
      .max(99999, 'Must be < 100.000'),
    subCategory: Yup.number()
      .required('(sub)Category is required')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // Functions to build form with useForm() hook
  const { register, handleSubmit, formState: { errors } } = useForm(formOptions);

  // Router
  const router = useRouter();

  function onSubmit(data) {

    // Make the expense object
    const expense = {
      year: data.date.getFullYear(),
      month: data.date.getMonth() + 1,
      day: data.ignoreDay ? null : data.date.getDate(),
      description: data.description,
      details: data.details,
      amountPaid: data.amountPaid,
      amountReimbursed: data.amountReimbursed,
      category: data.subCategory,
      recurring: true
    };
    
    return expenseService.createNewExpense(expense)
      .then((res) => {
        alertService.success('Expense created', { keepAfterRouteChange: true });
        router.push('expenses');
      })
  }

  // States
  const [selectedMainCat, setMainCategory] = React.useState('');
  const [selectedSubCat, setSubCategory] = React.useState('');
  const [categories, setCategories] = React.useState([]);

  // Effects
  React.useEffect(() => {
    categoryService.getCategories().then(x => setCategories(x));
  }, []);

  // Handle change listener
  const handleChange = (event) => {
    const {name, value} = event.target;

    switch (name) {
    case 'category': 
      setMainCategory(value); 
      break;

    case 'subCategory': 
      setSubCategory(value);
      break;

    default:
      break;
    }
  };

  // -------------------------------------------
  // Categories helper
  // -------------------------------------------
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

    return subCategories;
  }


  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 4 }}>
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
              inputProps={{ 
                max: "2050-01-01",
                min: "2012-01-01" 
              }}
              error={errors.date? true: false}
              helperText={errors.date?.message}
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
              inputProps={{ maxLength: 70 }}
              error={errors.description? true: false}
              helperText={errors.description?.message}
              {...register('description')}
            />
            <Divider sx={{ mb: 1, mt: 1}}/>
            <TextField
              margin="normal"
              required
              id="details"
              label="Details"
              defaultValue=""
              inputProps={{ maxLength: 70 }}
              helperText={errors.details?.message}
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
              inputProps={{ inputMode: 'numeric' }}
              error={errors.amountPaid? true: false}
              helperText={errors.amountPaid?.message}
              {...register('amountPaid')}
            />
            <TextField
              margin="normal"
              id="amountReimbursed"
              label="Amount Reimbursed"
              defaultValue="0"
              inputProps={{ inputMode: 'numeric' }}
              error={errors.amountReimbursed? true: false}
              helperText={errors.amountReimbursed?.message}
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
                error={errors.subCategory? true: false}
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
