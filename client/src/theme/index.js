import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0B3D91', // Deep navy blue - commonly used in government sites
      light: '#1756B8',
      dark: '#082B66',
    },
    secondary: {
      main: '#D14836', // Indian flag saffron shade
      light: '#E16B5A',
      dark: '#B33D2C',
    },
    success: {
      main: '#138808', // Indian flag green shade
      light: '#1CAC0C',
      dark: '#0E6406',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Noto Sans', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#0B3D91',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#0B3D91',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#0B3D91',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#0B3D91',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#0B3D91',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#0B3D91',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0B3D91',
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default theme; 