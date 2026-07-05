import React from 'react'
import { ThemeProvider } from 'styled-components'

import { createTheme, GlobalStyle } from '@kozydozy/theme'
import { mkEquineTokens } from '@kozydozy/tokens'

import { useAppSelector } from '@/store'

// Built once from the MK Equine token preset; reproduces the previous
// light/dark themes exactly (same palette) plus `components` for shared UI.
const themes = createTheme(mkEquineTokens)

interface StyledThemeProviderProps {
    children: React.ReactNode
}

/**
 * Bridges Redux theme.mode ('light' | 'dark') → styled-components ThemeProvider.
 * Renders GlobalStyle inside the provider so it always has theme access.
 */
export function StyledThemeProvider({ children }: StyledThemeProviderProps) {
    const mode = useAppSelector((state) => state.theme.mode)
    const theme = mode === 'dark' ? themes.dark : themes.light

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    )
}
