import { createTheme } from '@mui/material/styles';
import '@fontsource/ibm-plex-sans';
import '@fontsource/ibm-plex-mono';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3366CC', // Wikimedia blue
    },
    secondary: {
      main: '#54595D', // Dark gray
    },
    success: {
      main: '#00AF89', // Green for success
    },
    warning: {
      main: '#FF9800', // Amber for pending/queued
    },
    error: {
      main: '#D73333', // Red for failed
    },
    background: {
      default: '#F8F9FA', // Warm gray page bg
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontFamilyMono: '"IBM Plex Mono", "Menlo", "Segoe UI Mono", "Roboto Mono", "Courier New", monospace',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.75rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.1rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 2,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
  },
});

export default theme;
