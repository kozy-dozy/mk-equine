// Loads the styled-components `DefaultTheme` augmentation from @kozydozy/theme
// into this app's compilation. Replaces the augmentation that used to live in
// the (now removed) local `src/styles/theme.ts`. Without this, the many
// `${({ theme }) => theme.colors...}` interpolations across the app lose their
// types once the local theme file is gone.
import '@kozydozy/theme'
