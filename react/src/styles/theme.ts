/**
 * styled-components theme for MK Equine
 * Premium equestrian palette ("luxury ranch")
 * Primary: #4a3426 (espresso brown)  Secondary: #6f7a58 (sage)  Accent: #a55b3a (terracotta)
 *
 * Import `useTheme` from styled-components to access these values
 * inside any styled component or CSS interpolation.
 */

export interface SportsTheme {
    isDark: boolean
    spacing: {
        xxs: string // 2px
        xs: string // 4px
        sm: string // 8px
        md: string // 16px
        lg: string // 24px
        xl: string // 32px
        '2xl': string // 48px
        '3xl': string // 64px
    }
    fontSize: {
        xs: string // 11px
        sm: string // 12px
        base: string // 14px
        md: string // 16px
        lg: string // 18px
        xl: string // 20px
        '2xl': string // 24px
        '3xl': string // 30px
    }
    colors: {
        primary: string
        primaryHover: string
        primaryLight: string // tint used for backgrounds, badges
        primaryLightAlt: string // new: lighter blue for backgrounds
        secondary: string
        secondaryHover: string
        secondaryLight: string
        brandRed: string // #c8102e
        accentGold: string // #fbb702
        text: {
            primary: string
            secondary: string // muted / label
            inverse: string // on dark bg
            dark: string // #111
            muted: string // #777, #555
            inverseMuted: string // rgba(255,255,255,0.7)
            disabled: string
        }
        bg: {
            page: string
            card: string
            input: string
            hover: string
            muted: string // #f3f4f6, #f9fafb
            overlay: string // modal backdrop
        }
        border: {
            default: string
            strong: string
            dark: string // #4b5563
        }
        status: {
            success: string
            error: string
            warning: string
            info: string
            successBg: string // #d1fae5
            errorBg: string // #fee2e2
        }
    }
    typography: {
        fontPrimary: string
        fontSecondary: string
    }
    radius: {
        sm: string
        md: string
        lg: string
        xl: string
        full: string
    }
    shadow: {
        sm: string
        md: string
        lg: string
    }
    transition: {
        fast: string
        base: string
    }
    zIndex: {
        dropdown: number
        modal: number
        toast: number
    }
}

const spacing = {
    xxs: '2px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
}

const fontSize = {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
}

export const lightTheme: SportsTheme = {
    isDark: false,
    spacing,
    fontSize,
    colors: {
        primary: '#4a3426',
        primaryHover: '#3a2a1e',
        primaryLight: '#f3ece2',
        primaryLightAlt: '#ede3d6',
        secondary: '#6f7a58',
        secondaryHover: '#5b6448',
        secondaryLight: '#eef0e7',
        brandRed: '#a55b3a',
        accentGold: '#a55b3a',
        text: {
            primary: '#3d2e22',
            secondary: '#6f6356',
            inverse: '#ffffff',
            dark: '#4a3426',
            muted: '#8f8069',
            inverseMuted: 'rgba(255,255,255,0.78)',
            disabled: '#bda98c',
        },
        bg: {
            page: '#fffdf8',
            card: '#ffffff',
            input: '#ffffff',
            hover: '#f7f1e7',
            muted: '#f7f1e7',
            overlay: 'rgba(40, 28, 18, 0.55)',
        },
        border: {
            default: '#e7ddd1',
            strong: '#d8ccba',
            dark: '#bda98c',
        },
        status: {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
            successBg: '#d1fae5',
            errorBg: '#fee2e2',
        },
    },
    typography: {
        fontPrimary: "'Playfair Display', Georgia, serif",
        fontSecondary: "'Inter', system-ui, sans-serif",
    },
    radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
    },
    shadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        md: '0 4px 12px rgba(0,0,0,0.10)',
        lg: '0 8px 24px rgba(0,0,0,0.12)',
    },
    transition: {
        fast: '0.15s ease',
        base: '0.25s ease',
    },
    zIndex: {
        dropdown: 100,
        modal: 200,
        toast: 300,
    },
}


export const darkTheme: SportsTheme = {
    isDark: true,
    spacing,
    fontSize,
    colors: {
        primary: '#d8b48f',
        primaryHover: '#e3c4a3',
        primaryLight: '#2a2018',
        primaryLightAlt: '#2e2419',
        secondary: '#9aa67d',
        secondaryHover: '#abb88e',
        secondaryLight: '#23291a',
        brandRed: '#c47a55',
        accentGold: '#c47a55',
        text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
            inverse: '#1a1f36',
            dark: '#fff',
            muted: '#94a3b8',
            inverseMuted: 'rgba(255,255,255,0.7)',
            disabled: '#64748b',
        },
        bg: {
            page: '#0f172a',
            card: '#1e293b',
            input: '#1e293b',
            hover: '#334155',
            muted: '#334155',
            overlay: 'rgba(0, 0, 0, 0.7)',
        },
        border: {
            default: '#334155',
            strong: '#475569',
            dark: '#1e293b',
        },
        status: {
            success: '#34d399',
            error: '#f87171',
            warning: '#fbbf24',
            info: '#60a5fa',
            successBg: '#134e4a',
            errorBg: '#7f1d1d',
        },
    },
    typography: lightTheme.typography,
    radius: lightTheme.radius,
    shadow: {
        sm: '0 1px 3px rgba(0,0,0,0.3)',
        md: '0 4px 12px rgba(0,0,0,0.4)',
        lg: '0 8px 24px rgba(0,0,0,0.5)',
    },
    transition: lightTheme.transition,
    zIndex: lightTheme.zIndex,
}


declare module 'styled-components' {
    export interface DefaultTheme extends SportsTheme {}
}
