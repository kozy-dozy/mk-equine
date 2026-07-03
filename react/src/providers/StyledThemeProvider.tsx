import React from 'react'
import { ThemeProvider } from 'styled-components'

import { useAppSelector } from '@/store'
import GlobalStyle from '@/styles/GlobalStyle'
import { lightTheme, darkTheme } from '@/styles/theme'

interface StyledThemeProviderProps {
    children: React.ReactNode
}

/**
 * Bridges Redux theme.mode ('light' | 'dark') → styled-components ThemeProvider.
 * Renders GlobalStyle inside the provider so it always has theme access.
 */
export function StyledThemeProvider({ children }: StyledThemeProviderProps) {
    const mode = useAppSelector((state) => state.theme.mode)
    const theme = mode === 'dark' ? darkTheme : lightTheme

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    )
}
