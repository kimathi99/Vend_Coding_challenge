import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/auth';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSnackbar from '../components/snackbar';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function HideViewPasswordIcon({ showPassword, setShowPassword }) {
  return (
    <IconButton
      onClick={() => setShowPassword(!showPassword)}
      edge="end"
      aria-label="toggle password visibility"
      style={{ marginTop: '8px' }}
    >
      {showPassword ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  );
}

function Register() {
  let {setRegemail ,apiUrl} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });
  const navigate= useNavigate();
  const {    
    setMessage,
    messageToSnackbar,
    setSeverity,
    severity,
    severityForSnackbar,
    setShowSnackbar,
    message,
    showSnackbar,
    handleClose,
    
}=useContext(AuthContext);
 
  const [errors, setErrors] = useState({});
  const [success, setsuccess] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);

  const handleAgreeChange = (event) => {
    setAgreeChecked(event.target.checked);
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isFormValid = () => {
    const { email, username, phone_number ,password,confirm_password } = formData;
  
    // Check if all required fields have data
    if (email.trim() !== '' && username.trim() !== '' && phone_number.trim() !== ''&& password.trim() !== ''&& confirm_password.trim() !== '') {
      // If agreeChecked is true, return true for submission
      if (agreeChecked) {
        return true;
      }
    }
  
    return false;
  };
  

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true); // Set isLoading to true when the form is submitted

    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match');
      setIsLoading(false); // Set isLoading to false to reactivate the button
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };
    fetch(`${apiUrl}/api/account/signup/`, requestOptions)
      .then((response) => {
        if (response.status === 400) {
          return response.json().then((data) => {
            const successMessage = Object.values(data).flat().join(', '); // Concatenate all values into a single string
            setMessage(successMessage);
            setSeverity('error');
            setShowSnackbar(true);
            setErrors(data);
            
          });
        } else if (response.status === 200) {
          return response.json().then((data) => {
            const successMessage = Object.values(data).flat().join(', '); // Concatenate all values into a single string
            setMessage(successMessage);
            setSeverity('success');
            setShowSnackbar(true);
            
            setsuccess(data);
           setRegemail(formData.email);
            localStorage.setItem('regemail', JSON.stringify(formData.email));    
            alert('logged in to Vendor');       
            
          });
        } else {
          return response.json();
        }
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false)); // Set isLoading to false once the API has returned
  };

  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email ? true : false}
                helperText={errors.email ? errors.email[0] : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username ? true : false}
                helperText={errors.username ? errors.username[0] : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="PhoneNumber"
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                error={errors.phone_number ? true : false}
                helperText={errors.phone_number ? errors.phone_number[0] : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password ? true : false}
                helperText={errors.password ? errors.password[0] : ''}
                InputProps={{
                  endAdornment: (
                    <HideViewPasswordIcon
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                error={errors.confirm_password ? true : false}
                helperText={errors.confirm_password ? errors.confirm_password[0] : ''}
                InputProps={{
                  endAdornment: (
                    <HideViewPasswordIcon
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  ),
                }}
              />
            </Grid>
                        
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              <Checkbox
                checked={agreeChecked}
                onChange={handleAgreeChange}
                color="primary"
              />
              Agree to our{' '}
              <Link href="/register/terms&conditions" variant='body2' style={{ textDecoration: 'none', color: 'blue' }}>
                Terms and Conditions
              </Link>
            </Typography>
          </Grid>

              <Button
              type="submit"
              fullWidth
              disabled={!isFormValid() || isLoading}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              >
              {/* Change button text based on isLoading */}
              {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>


          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 5 }}
      >
        {' © '}
        <Link color="inherit" href="#">
          Powered by Vend
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <CustomSnackbar
      showSnackbar={showSnackbar}
      handleClose={handleClose}
      message={message}
      severity={severity}
      />
    </Container>
  );
}

export default Register;
