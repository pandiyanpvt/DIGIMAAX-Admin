import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#28045C',
      light: '#3D0A6B',
      dark: '#1A0238',
    },
    secondary: {
      main: '#FF4081',
      light: '#FF79B0',
      dark: '#C2185B',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '3.5rem', lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: '2.5rem', lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: '2rem', lineHeight: 1.4 },
    h4: { fontWeight: 500, fontSize: '1.5rem', lineHeight: 1.4 },
    h5: { fontWeight: 500, fontSize: '1.25rem', lineHeight: 1.5 },
    h6: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '12px 24px',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(40, 4, 92, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(40, 4, 92, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
})

