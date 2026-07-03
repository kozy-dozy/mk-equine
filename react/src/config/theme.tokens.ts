/**
 * MK Equine brand tokens.
 * These feed the legacy Tailwind-based UI component system (ConfigProvider).
 * Actual styled-components theming lives in src/styles/theme.ts.
 *
 * Primary: #8a5a2b (saddle brown)   Secondary: #7d8c5a (sage green)
 * Closest Tailwind approximation: amber-800 / lime-700
 */
export const THEME_TOKENS = {
    // Primary brand color (Tailwind color name used by legacy UI components)
    primaryColor: 'amber',
    primaryColorLevel: 800 as const,

    // Theme defaults
    defaultMode: 'light' as 'light' | 'dark',

    // Hex for meta theme-color tags — matches saddle brown
    themeColorHex: '#8a5a2b',

    // Component tokens used by legacy UI kit
    components: {
        button: {
            solidBg: 'bg-amber-800 hover:bg-amber-900',
            solidText: 'text-white',
        },
        announcement: {
            bg: 'bg-amber-900',
            text: 'text-amber-50',
        },
        hero: {
            gradient: 'from-amber-50 via-white to-lime-50',
            darkGradient: 'from-amber-950/30 via-gray-900 to-lime-950/20',
            badge: 'border-amber-200 bg-white/70 text-amber-800',
            badgeDark: 'bg-gray-900/50 border-amber-900 text-amber-200',
        },
        card: {
            heroBorder:
                'border-amber-200/60 bg-gradient-to-r from-amber-50/70 to-white',
            heroBorderDark:
                'dark:border-amber-500/15 dark:from-amber-500/10 dark:to-gray-900',
        },
        badge: {
            primary: 'text-amber-800',
            primaryDark: 'dark:text-amber-400',
        },
        icons: {
            primary: 'text-amber-800',
            primaryDark: 'dark:text-amber-400',
        },
    },
} as const
