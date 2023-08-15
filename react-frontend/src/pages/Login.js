import React, { useContext,useState,useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { AuthContext } from '../auth/auth';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CustomSnackbar from '../components/snackbar';
import { UserAuth } from '../auth/auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import HCaptcha from '@hcaptcha/react-hcaptcha';




function Login() {
  const auth = UserAuth();
  const navigate = useNavigate();
  const { setAuthTokens, setUser, handleModalClose ,apiUrl } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [severity, setSeverity] = useState('info');
  const [message, setMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const site_key= process.env.REACT_APP_HCAPTCHA_SITE_KEY

  const messageToSnackbar = 'Logged In';
  const severityForSnackbar = 'success';
  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);
 

  const onLoad = () => {
    // this reaches out to the hCaptcha JS API and runs the
    // execute function on it. you can use other functions as
    // documented here:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current.execute();
  };

  useEffect(() => {

    if (token)
      console.log(`hCaptcha Token: ${token}`);

  }, [token]);
  
  const isFormValid = () => {
    const { email, password } = formData;
  
    // Check if all required fields have data
    if (email.trim() !== '' && password.trim() !== '' ) {
      return true;
    }
  
    return false;
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCaptchaVerify = (token) => {
    // You can perform additional verification or store the token if needed
    setCaptchaVerified(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };
    fetch(`${apiUrl}/api/token/`, requestOptions)
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
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            setMessage(messageToSnackbar);
            setSeverity(severityForSnackbar);
            setShowSnackbar(auth.user ? false : true);
            navigate('/', { replace: true });
          });
        } else {
          return response.json();
        }
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ padding: 2 }}>
      <Box sx={{ position: 'relative' }}>
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
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              helperText={errors.email ? errors.email[0] : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password ? true : false}
              helperText={errors.password ? errors.password[0] : ''}
              InputProps={{
                endAdornment: (
                  <Link
                    variant="body2"
                    onClick={togglePasswordVisibility}
                    style={{ color: '#4aaf51', marginLeft: '0.5rem', marginRight: '0.5rem' }}
                  >
                    {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </Link>
                ),
              }}
            />          
         
         {/* <div className="captcha-container">
         <HCaptcha
            sitekey="32d6506b-08fd-4ea6-ae5d-30a9cb4e9b6e"
            size="normal"
            onLoad={onLoad}
            onVerify={handleCaptchaVerify}
            ref={captchaRef}
          />

          </div> */}
     


            <Button
              type="submit"
              fullWidth
              disabled={!isFormValid()}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid  onClick={handleModalClose} item xs>
                <Link to="/forgotpassword" variant="body2" style={{ color: '#4aaf51' }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid onClick={handleModalClose} item>
                <Link to="/register"  style={{ color: '#4aaf51' }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <CustomSnackbar
                showSnackbar={showSnackbar}
                handleClose={handleClose}
                message={message}
                severity={severity}
              />
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
