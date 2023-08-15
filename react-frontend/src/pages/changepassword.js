import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { AuthContext } from '../auth/auth';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useParams, Link } from 'react-router-dom';
import CustomSnackbar from '../components/snackbar';

function ChangePassword() {
  const {
    apiUrl,
    setMessage,
    messageToSnackbar,
    setSeverity,
    severity,
    severityForSnackbar,
    setShowSnackbar,
    message,
    showSnackbar,
    handleClose,
    authTokens, // Make sure this is available from AuthContext
  } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const [loading, setLoading] = useState(false); // State to handle loading
  const [counter, setCounter] = useState(0); // State to handle the countdown

  const { token } = useParams();
   const initialstate={
    old_password: '',
    new_password: '',
    confirm_password: '',
  }

  const [formData, setFormData] = useState(initialstate);

  const isFormValid = () => {
    const { confirm_password, new_password } = formData;
    // Check if all required fields have data
    if (confirm_password.trim() !== '' && new_password.trim() !== '') {
      // Check if passwords match
      if (new_password === confirm_password) {
        return true;
      }
    }
    return false;
  };

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setErrors({ password: ['Passwords do not match'] });
      return;
    }
    setErrors({});
    setLoading(true);
    setCounter(20); // Set the countdown to 20 seconds
  
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authTokens.access}` },
      body: JSON.stringify(formData),
    };
    fetch(`${apiUrl}/api/change_password/`, requestOptions)
      .then((response) => {
        if (response.status === 400) {
          return response.json().then((data) => {
            // Extract error messages dynamically from the data object
            const errorMessages = Object.values(data).flat();
            setMessage(errorMessages.join(', '));
            setSeverity('error');
            setShowSnackbar(true);
            setLoading(false);
            setCounter(0);
          });
        } else if (response.status === 200) {
          return response.json().then((data) => {
            // Extract success messages dynamically from the data object
            const successMessage = Object.values(data).flat().join(', '); // Concatenate all values into a single string
            setMessage(successMessage);
            setSeverity('success');
            setShowSnackbar(true);
            setSuccess(data); // Optionally store the success data in the state
            setLoading(false);
            setCounter(0);
          });
        } else {
          return response.json();
        }
      })
      .then((data) => console.log(data))
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setCounter(0);
      });
  };
  
  useEffect(() => {
    if (counter > 0 && loading) {
      // Start the countdown when loading is true and the counter is greater than 0
      const timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);

      // Clear the interval when the component unmounts or when the counter reaches 0
      return () => clearInterval(timer);
    }
  }, [counter, loading]);

  return (
    <Container component="main" maxWidth="xs" sx={{ padding: 2, elevation: 60 }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Change Your Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Old Password */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Old Password"
            type={showPassword ? 'text' : 'password'}
            name="old_password"
            value={formData.old_password}
            onChange={handleInputChange}
            error={errors.old_password ? true : false}
            helperText={errors.old_password ? errors.old_password : ''}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {/* New Password */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            name="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password[0] : ''}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {/* Confirm New Password */}
          <TextField
            margin="normal"
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
                <IconButton
                  onClick={handleShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {/* Reset Password Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, color: 'white' }}
            disabled={!isFormValid() || loading} // Disable the button when the form is invalid or during loading
          >
            {loading && counter > 0 ? `Try Again After ${counter} seconds` : 'Change Password'}
          </Button>
          <CustomSnackbar
            showSnackbar={showSnackbar}
            handleClose={handleClose}
            message={message}
            severity={severity}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default ChangePassword;
