import React, { useEffect,useState, useContext } from 'react';
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
import { useParams ,Link } from 'react-router-dom';

function ResetPassword() {
  const { apiUrl } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [success, setsuccess] = useState({});
  const {uidb64 = '', token = '' } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
    uidb64 : uidb64,
    token : token ,
  });
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
    const { confirm_password, password } = formData;
  
    // Check if all required fields have data
    if (confirm_password.trim() !== '' && password.trim() !== '') {
      // Check if passwords match
      if (password === confirm_password) {
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

    // Check password rules
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (name === 'password') {
      if (value.length < 6) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: ['Password should be at least 6 characters long'],
        }));
      } else if (!passwordRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: [
            'Password should contain at least one uppercase letter and one numeric character',
          ],
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
        
        }));
      }
    }
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [isLoading, setIsLoading] = useState(false);

  // ... other code ...

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setErrors({ password: ['Passwords do not match'] });
      return;
    }
    setErrors({});
    setIsLoading(true); // Step 3: Set loading state to true before submitting the API
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };
    fetch(`${apiUrl}/api/reset_password/`, requestOptions)
      .then((response) => {
        setIsLoading(false); // Step 3: Set loading state to false after receiving the API response
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
            setsuccess(data);
            const successMessage = Object.values(data).flat().join(', '); // Concatenate all values into a single string
            setMessage(successMessage);
            setSeverity('sucess');
            setShowSnackbar(true);
            navigate('/login',{'replace':true})
          });
        } else {
          return response.json();
        }
      })
      .then((data) => console.log(data))
      .catch((error) => {
        setIsLoading(false); // Step 3: Set loading state to false in case of an error
        console.error(error);
      });
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
        


        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}> 
        <TextField
          margin="normal"
          required
          fullWidth
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, color: 'white' }}
            disabled={isLoading} // Disable the button when the API is being submitted
          >
            {isLoading ? 'Loading...' : 'Reset Password'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/login"  style={{ color: '#4aaf51' }}>
              {"Login"}
              </Link>
            </Grid>
            <Grid item>
              <Link to="/forgotPassword"  style={{ color: '#4aaf51' }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPassword;
