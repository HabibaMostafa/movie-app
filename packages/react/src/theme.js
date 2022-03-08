import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#D29703',
    },
    secondary: {
      main: '#ffffff',
      contrastText: 'rgba(127,34,34,0.87)',
    },
    background: {
      default: '#080000',
      paper: 'rgba(26,26,26,0.89)',
    },
    divider: 'rgba(255,255,255,0.12)',
  }
});

export default theme;

