import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f1f1f1', // Set the desired background color here
    },
    overrides: {
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: '#662E9B',
        },
      },
    },
    primary: {
      main: 'rgb(47, 226, 80)',
    },
    secondary: {
      light: '#fc030f',
      main: '#FF0000',
      contrastText: '#ffcc00',
    },
    micro: {
      main: 'rgb(128, 128, 128)',
    },
    custom: {
      light: '#ffa726',
      main: '#f57c00',
      dark: '#ef6c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

export default theme;
