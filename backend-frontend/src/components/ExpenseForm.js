import * as React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router'

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

import { expenseService, alertService } from 'src/services';
import { getParentCategoryId, getSubCategories } from 'src/helpers'
import { AppContext } from 'src/pages/_app';

const getInitialFormData = (expense, categories) => {
  return {
    // Come up with default category using props
    mainCategory: expense.category ? getParentCategoryId(categories, Number(expense.category)) : '',
    subCategory: expense.category ? expense.category : '',
  }
}

const getDefaultDate = (expense) => {
  let defaultDate = new Date().toISOString().split('T')[0];
  if (expense.year && expense.month && expense.day) {
    defaultDate = new Date(expense.year, expense.month - 1, expense.day).toISOString().split('T')[0];
  } else if (expense.year && expense.month) {
    defaultDate = new Date(expense.year, expense.month - 1, 1).toISOString().split('T')[0];
  }

  return defaultDate;
}

export default function ExpenseForm(props) {
  const context = React.useContext(AppContext);
  const categories = context?.categories.all;

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
    const exp = {
      year: data.date.getFullYear(),
      month: data.date.getMonth() + 1,
      day: data.ignoreDay ? null : data.date.getDate(),
      description: data.description,
      details: data.details,
      amountPaid: data.amountPaid,
      amountReimbursed: data.amountReimbursed,
      category: data.subCategory,
      recurring: data.recurring
    };

    if (action === 'create') {
      return expenseService.createNewExpense(exp)
        .then(() => {
          alertService.success('Expense created', { keepAfterRouteChange: true });
          router.push('/');
        })
        .catch((err => alertService.error(err)));
    } else if (action === 'edit') {
      return expenseService.editExpense(expenseId, exp)
        .then(() => {
          alertService.success('Expense edited', { keepAfterRouteChange: true });
          router.push('/');
        })
        .catch((err => alertService.error(err)));
    }
  }

  // -------------------------------------------
  // Props
  // -------------------------------------------
  const { expenseId, expense, action } = props;

  // States
  const [formData, setFormData] = React.useState(getInitialFormData(expense, categories));

  // Categories and sub-categories
  const mainCategories = context?.categories.mainCategories;
  const subCategories = getSubCategories(categories, formData.mainCategory);


  // Handle change listener
  const handleChange = (event) => {
    event.preventDefault()
    const { name, value } = event.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    // For convenience, when a category is set and there 
    // is only 1 sub-category, select it as default
    if (name === 'mainCategory') {
      const sub = getSubCategories(categories, value);
      if (sub.length == 1) {
        setFormData(prevFormData => ({
          ...prevFormData,
          subCategory: sub[0].id
        }));
      } else {
        // need to reset subCategory, since options have changed
        setFormData(prevFormData => ({
          ...prevFormData,
          subCategory: ''
        }));
      }
    }
  };

  // ---------------------------------------
  // Come up with default date using props
  // ---------------------------------------
  const defaultDate = getDefaultDate(expense);

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
          <Stack direction="row" spacing={3} alignItems="flex-end" justifyContent="flex-start">
            <TextField
              id="date"
              label="Date"
              type="date"
              variant="standard"
              defaultValue={defaultDate}
              sx={{ minWidth: 160, maxWidth: 180 }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: "2050-01-01",
                min: "2012-01-01"
              }}
              error={errors.date ? true : false}
              helperText={errors.date?.message}
              {...register('date')}
            />
            <FormGroup>
              <Tooltip title="On expense list day will be marked with a dash">
                <FormControlLabel
                  label={<Typography variant="body2">{"Day doesn't matter"}</Typography>}
                  labelPlacement="end"
                  control={
                    <Checkbox 
                      size="small"
                      defaultChecked={expense.day === "" ? true : false}
                      
                      {...register('ignoreDay')}
                    />
                  }
                />
              </Tooltip>
            </FormGroup>
          </Stack>
          {
            /* 
            // ----------------------------------------
            // Description and details
            // ----------------------------------------
            */
          }
          <Box>
            <Stack>
              <TextField
                variant="standard"
                margin="normal"
                autoFocus
                required
                id="description"
                label="Description"
                defaultValue={expense.description || ""}
                inputProps={{ maxLength: 70 }}
                sx={{ width: 230 }}
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                {...register('description')}
              />
              <TextField
                variant="standard"
                margin="normal"
                id="details"
                label="Details"
                defaultValue={expense.details || ""}
                inputProps={{ maxLength: 70 }}
                sx={{ width: 230 }}
                helperText={errors.details?.message}
                {...register('details')}
              />
            </Stack>
          </Box>
          {
            /* 
            // ----------------------------------------
            // Amount paid and reimbursed
            // ----------------------------------------
            */
          }
          <Stack direction="row" spacing={2} alignItems="baseline" justifyContent="space-between">
            <TextField
              variant="standard"
              margin="normal"
              required
              id="amountPaid"
              label="Amount paid"
              defaultValue={expense.amountPaid || ""}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ width: 230 }}
              error={errors.amountPaid ? true : false}
              helperText={errors.amountPaid?.message}
              {...register('amountPaid')}
            />
            <TextField
              variant="standard"
              margin="normal"
              id="amountReimbursed"
              label="Amount Reimbursed"
              defaultValue={expense.amountReimbursed || "0"}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ width: 230 }}
              error={errors.amountReimbursed ? true : false}
              helperText={errors.amountReimbursed?.message}
              {...register('amountReimbursed')}
            />
          </Stack>
          {
            /* 
            // ----------------------------------------
            // Category and sub-category
            // ----------------------------------------
            */
          }
          <Stack direction="row" spacing={2} alignItems="baseline" justifyContent="space-between">
            <FormControl variant="standard" sx={{ mt: 1, width: '45%' }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="mainCategory"
                name="mainCategory"
                label="Category"
                value={formData.mainCategory}
                onChange={handleChange}
              >
                {
                  // Get the main categories
                  mainCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ mt: 1, minWidth: '45%' }}>
              <InputLabel id="subCategory-select-label">Sub-category</InputLabel>
              <Select
                labelId="subCategory-label"
                id="subCategory"
                name="subCategory"
                label="Sub-category"
                value={formData.subCategory}
                error={errors.subCategory ? true : false}
                {...register('subCategory')}
                onChange={handleChange}
              >
                {
                  // Get the sub categories for selected main category
                  subCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
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
          <FormGroup sx={{ mt: 1, mb: 2 }}>
            <Tooltip title="On expense list will be marked with bold and can be copied to next month upon request">
              <FormControlLabel
                label="Recurring"
                control={
                  <Checkbox {...register('recurring')} defaultChecked={
                    expense.recurring === "true" ? true : false
                  } />
                }
              />
            </Tooltip>
          </FormGroup>
        </Stack>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {action === 'create' ? 'Create' : 'Save'}
        </Button>
      </Box>
    </Container>
  );
}

ExpenseForm.propTypes = {
  expenseId: PropTypes.number,
  expense: PropTypes.object,
  action: PropTypes.string.isRequired,
};