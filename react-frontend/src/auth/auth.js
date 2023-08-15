import React,{ createContext,useContext, useState ,useEffect} from 'react'
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()


const AuthProvider = ({children}) => {
    const apiUrl = process.env.REACT_APP_API_URL;
  
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
  
    const [severity, setSeverity] = useState('info');
    const [message, setMessage] = useState('');
    const messageToSnackbar = user ? 'Merchant details not updated' : 'Login Required';
    const severityForSnackbar = user ? 'info' : 'error';
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showSearchBar,setSearchBar]=useState(false);
    const [open, setOpen] = useState(false)

    const navigate =useNavigate()
    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        localStorage.removeItem('regemail')
        alert("Logged out ")
        navigate('/', { replace: true });
    }
   
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setShowSnackbar(false);
      }; 
    
    const handleModalClose = () => {
        setOpen(false);
      };
    

    let contextData = {
        user:user,
        authTokens:authTokens,
        logoutUser:logoutUser,
        setUser:setUser,
        setAuthTokens:setAuthTokens,
        showSnackbar:showSnackbar,
        setShowSnackbar:setShowSnackbar,
       
        
        setMessage:setMessage,
        messageToSnackbar:messageToSnackbar,
        setSeverity :setSeverity,
        severity: severity,
        severityForSnackbar :severityForSnackbar,
        setShowSnackbar :setShowSnackbar,
        message :message,
        handleClose: handleClose,
        
        
        apiUrl:apiUrl,
       
    }



    return(
        <AuthContext.Provider value={contextData} >
            { children}
        </AuthContext.Provider>
    )
}

const UserAuth= ()=>{
    return useContext (AuthContext)
}

export { AuthProvider, UserAuth, AuthContext };