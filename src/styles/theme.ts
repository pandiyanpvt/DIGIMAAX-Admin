import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#FF4081',
      light: '#FF79B0',
      dark: '#C2185B',
    },
    background: {
      default: '#0A0A0F',
      paper: '#1A1A2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
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
          boxShadow: '0 4px 14px 0 rgba(33, 150, 243, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(33, 150, 243, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
})

