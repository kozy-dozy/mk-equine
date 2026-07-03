import { createGlobalStyle } from 'styled-components'

/**
 * GlobalStyle — injects base CSS via styled-components.
 * Reads from the active SportsTheme so light/dark mode
 * colours update automatically when the theme switches.
 *
 * Note: index.css still handles the @import, box-sizing reset,
 * and animation keyframes — those don't need theme access.
 */
const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    /* CSS custom properties for plain-CSS components (Dialog, Drawer) */
    :root {
        --sc-bg-card: ${({ theme }) => theme.colors.bg.card};
        --sc-bg-page: ${({ theme }) => theme.colors.bg.page};
        --sc-bg-hover: ${({ theme }) => theme.colors.bg.hover};
        --sc-overlay: ${({ theme }) => theme.colors.bg.overlay};
        --sc-border: ${({ theme }) => theme.colors.border.default};
        --sc-text-primary: ${({ theme }) => theme.colors.text.primary};
        --sc-text-secondary: ${({ theme }) => theme.colors.text.secondary};
        --sc-primary: ${({ theme }) => theme.colors.primary};
        --sc-shadow-lg: ${({ theme }) => theme.shadow.lg};
    }

    html {
        scroll-behavior: smooth;
    }

    body {
        font-family: ${({ theme }) => theme.typography.fontSecondary};
        color: ${({ theme }) => theme.colors.text.primary};
        background-color: ${({ theme }) => theme.colors.bg.page};
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        transition: background-color ${({ theme }) => theme.transition.base},
                    color ${({ theme }) => theme.transition.base};
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: ${({ theme }) => theme.typography.fontPrimary};
        font-weight: 600;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    input, textarea, select, button {
        font-family: inherit;
    }

    :focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.primary};
        outline-offset: 2px;
    }
`

export default GlobalStyle
