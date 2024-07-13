import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import React from 'react'

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
            {children}
        </ThemeProvider>
    )
}

export default UseThemeProvider