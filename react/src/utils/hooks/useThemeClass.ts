import { useTheme } from 'styled-components'

import type { SportsTheme } from '@/styles/theme'

function useThemeClass() {
    const theme = useTheme() as SportsTheme
    const primary = theme.colors.primary

    return {
        ringTheme: primary,
        borderTheme: primary,
        bgTheme: primary,
        textTheme: primary,
    }
}

export default useThemeClass
