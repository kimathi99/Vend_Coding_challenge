import React, { useState, useContext ,useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import CustomSnackbar from '../components/snackbar';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { AuthContext } from '../auth/auth';

function ForgotPassword() {
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const { apiUrl } = useContext(AuthContext);
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

  const isFormValid = () => {
    const { email} = formData;
  
    // Check if all required fields have data
    if (email.trim() !== '') {
      return true;
    }
  
    return false;
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [tryAgainTime, setTryAgainTime] = useState(null); // State variable to track the try again time

  useEffect(() => {
    // Check if the tryAgainTime is set and not expired
    if (tryAgainTime && tryAgainTime > Date.now()) {
      // If it's not expired, set a timeout to update the tryAgainTime state every second
      const timer = setTimeout(() => {
        setTryAgainTime(tryAgainTime - 1000);
      }, 1000);

      // Clean up the timer when the component unmounts or tryAgainTime expires
      return () => clearTimeout(timer);
    } else {
      // If tryAgainTime is expired or not set, reset isLoading to false
      setIsLoading(false);
    }
  }, [tryAgainTime]);

  // ... other code

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };
    fetch(`${apiUrl}/api/forgot_password/`, requestOptions)
      .then((response) => {
        if (response.status === 400) {
          return response.json().then((data) => {
            setErrors(data);
            setIsLoading(false);
            const successMessage = Object.values(data).flat().join(', '); // Concatenate all values into a single string
            setMessage(successMessage);
            setSeverity('error');
            setShowSnackbar(true);
          });
        } else if (response.status === 200) {
          return response.json().then((data) => {
            setSuccess(data);
            const successMessage = Object.values(data).flat().join(', '); // Concatenate all values into a single string
            setMessage(successMessage);
            setSeverity('success');
            setShowSnackbar(true);
            // Set the tryAgainTime to 1 minute (60,000 milliseconds) from the current time
            setTryAgainTime(Date.now() + 60000);
            return data;
          });
        } else {
          return response.json();
        }
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

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
        
        <Typography component="h2" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email: ''}
          />

            <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, color: 'white' }}
            disabled={!isFormValid() || isLoading || (tryAgainTime && tryAgainTime > Date.now())}
            // If tryAgainTime is set, display the countdown timer on the button
            // Otherwise, display the default text based on isLoading state
            >
            {tryAgainTime && tryAgainTime > Date.now()
            ? `Try again after ${Math.ceil((tryAgainTime - Date.now()) / 1000)} seconds`
            : isLoading
            ? 'Submitting...'
            : 'Submit'}
            </Button>
          <CustomSnackbar
                showSnackbar={showSnackbar}
                handleClose={handleClose}
                message={message}
                severity={severity}
              />
          <Grid container>
            <Grid item xs>
              <Link href="/login" variant="body2" color="#4aaf51">
              {"Login"}

              </Link>
            </Grid>
            <Grid item>
              <Link href="/forgotpassword" variant="body2" color="#4aaf51">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
