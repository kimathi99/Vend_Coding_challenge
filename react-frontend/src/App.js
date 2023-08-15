import React from 'react';
import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import { AuthProvider } from './auth/auth';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';

import Login from './pages/Login';
import Register from './pages/register';
import RequireAuth from './auth/requireAuth';
import ForgotPassword from './pages/forgotpassword';
import ResetPassword from './pages/resetpassword';
import {Navbar} from './components/header';
import { ThemeProvider } from '@mui/material/styles';
import theme from './context/materialui-context/materialui';
import ChangePassword from './pages/changepassword';
function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>  
         {/* This is the header  knows what to render it includes the appbar */}
         <Navbar/>
                         
          <Routes>                  
              <Route path="/" element={<Home />} />
              <Route path="/changepassword" element={<RequireAuth><ChangePassword/></RequireAuth>} />      
              <Route path="/login" element={<Login />} />          
              <Route path="/register" element={<Register />} />                                       
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword/:uidb64/:token/" element={<ResetPassword />} />
              
              <Route path="*" element={<NoMatch />} />         
            
          </Routes>       
         
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;