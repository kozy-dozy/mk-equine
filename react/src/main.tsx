import { GiHorseshoe } from 'react-icons/gi'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { createTheme } from '@kozydozy/theme'
import { mkEquineTokens } from '@kozydozy/tokens'
import { configureSpinnerIcon, configureToastPortal } from '@kozydozy/ui'

import App from './App'
import AppErrorBoundary from './components/AppErrorBoundary'
import { RootProviders } from './providers/RootProviders'
import store from './store'
import { initGA } from './utils/analytics/googleAnalytics'
import { initSentry } from './utils/sentry'

import './index.css'

// --- Shared-package bootstrap (preserves prior behaviour) ---
// 1. Spinner shows MK Equine's horseshoe everywhere (shared Spinner is icon-agnostic).
// 2. Toasts render in a detached root, so re-establish store + themed context —
//    exactly what the old local ToastWrapper did with `store` + light/dark themes.
const platformThemes = createTheme(mkEquineTokens)
configureSpinnerIcon(<GiHorseshoe />)
configureToastPortal((node) => (
    <Provider store={store}>
        <ThemeProvider
            theme={
                store.getState().theme?.mode === 'dark'
                    ? platformThemes.dark
                    : platformThemes.light
            }
        >
            {node}
        </ThemeProvider>
    </Provider>
))

initSentry()
initGA()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AppErrorBoundary>
            <RootProviders>
                <App />
            </RootProviders>
        </AppErrorBoundary>
    </React.StrictMode>,
)
