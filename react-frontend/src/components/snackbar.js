import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function CustomSnackbar({ showSnackbar, handleClose, message, severity }) {
  


  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={showSnackbar}
      onClose={handleClose}
      transitionDuration={{ enter: 300, exit: 100 }}
      TransitionComponent={SlideTransition}
      autoHideDuration={6000} // Add this prop to set a timeout of 6 seconds
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
