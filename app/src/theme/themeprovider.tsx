import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import { Provider } from 'react-redux'
import userdata from '../redux/userdataSlice'
import { GoogleOAuthProvider } from '@react-oauth/google'
const store = configureStore({
    reducer: userdata,
})
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

function UseThemeProvider({ children }: { children: React.ReactNode }) {



    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#fff',
            },
            secondary: {
                main: '#fff',
            }
        }
    })
    return (
        <ThemeProvider theme={darkTheme}>
            <GoogleOAuthProvider clientId=''>
                <Provider store={store}>
                    {children}
                </Provider>
            </GoogleOAuthProvider>

        </ThemeProvider>
    )
}

export default UseThemeProvider