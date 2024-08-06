import { ThemeProvider, createTheme } from '@mui/material';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import userdata from '../redux/slice/userdataSlice';
import { GoogleOAuthProvider } from '@react-oauth/google';

const store = configureStore({
  reducer: userdata,
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

function UseThemeProvider({ children }: { children: React.ReactNode }) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0bec5',
      },
      divider: '#424242',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'capitalize',
            borderRadius: '8px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: '#616161',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <GoogleOAuthProvider
        clientId={
          import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_DEFAULT_CLIENT_ID'
        }
      >
        <Provider store={store}>{children}</Provider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default UseThemeProvider;
