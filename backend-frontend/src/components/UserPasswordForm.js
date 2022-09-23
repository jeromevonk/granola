import React from "react";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import MoneyIcon from '@mui/icons-material/Money';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from 'src/components/Link';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function UserPasswordForm(props) {
  const { action, register, handleSubmit, errors } = props;

  // Show password?
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  let title = '';
  let buttonText = '';
  let linkText = '';
  let linkHref = '';

  if (action === 'register') {
    title = 'Register';
    buttonText = 'REGISTER';
    linkText = 'LOG IN';
    linkHref = '/account/login';
  } else {
    title = 'Login';
    buttonText = 'LOGIN';
    linkText = 'REGISTER';
    linkHref = '/account/register';
  }

  return (
    <Box
      backgroundColor='#008080'
      display='flex'
      justifyContent='center'
      minHeight='100vh'
    >
      <Stack
        justifyContent="center"
      >
        <Paper
          elevation={12}
          style={{ padding: 30, width: 280, height: 450 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: '#008080' }}>
            <MoneyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, ml: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              error={errors.username ? true : false}
              helperText={errors.username?.message}
              {...register('username')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              error={errors.password ? true : false}
              helperText={errors.password?.message}
              {...register('password')}
              InputProps={{ // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {buttonText}
            </Button>
            <Button>
              <Link href={linkHref} variant="body2">
                {linkText}
              </Link>
            </Button>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}

UserPasswordForm.propTypes = {
  action: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};
