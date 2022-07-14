import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MoneyIcon from '@mui/icons-material/Money';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Button';
import Link from 'src/components/Link';

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService, alertService } from 'src/services';

export default function Register() {
  const router = useRouter();

  // form validation rules 
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState; // TODO

  function onSubmit(user) {
    return userService.register(user)
      .then(() => {
        alertService.success('Registration successful', { keepAfterRouteChange: true }); // TODO mais bonita  msg
        router.push('login');
      })
      .catch(alertService.error);  //TODO
  }

  return (
    <Box>
      <Paper elevation={12} style={{padding:20, height:'70vh', width:280, margin:"20px auto"}}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Avatar sx={{ m: 1, bgcolor: 'green' }}>
          <MoneyIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, ml: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            {...register('username')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password')} 
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid>
            <Link href="/account/login" variant="body2">
              {"Log in"}
            </Link>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
