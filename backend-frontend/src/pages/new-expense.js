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
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';

export default function Index() {

  // get functions to build form with useForm() hook
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    /*return userService.login(username, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl);
      })
      .catch(alertService.error); // TODO mostrar erro corretamente
      */
    console.log("Submit!");
    console.log(data);
    return;
  }

  const [mainCategory, setMainCategory] = React.useState(1);
  const [subCategory, setSubCategory] = React.useState(22);

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
              id="details"
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
                value={mainCategory}
                onChange={handleChange}
              >
                <MenuItem value={1}>Ten</MenuItem>
                <MenuItem value={2}>Twenty</MenuItem>
                <MenuItem value={3}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: '50%' }}>
              <InputLabel id="subcategory-select-label">Sub-category</InputLabel>
              <Select
                labelId="subcategory-label"
                id="subcategory"
                name="subcategory"
                label="Sub-category"
                value={subCategory}
                {...register('subcategory')}
                onChange={handleChange}
              >
                <MenuItem value={22}>Palmeiras</MenuItem>
                <MenuItem value={23}>Food</MenuItem>
                <MenuItem value={24}>Doctors</MenuItem>
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
