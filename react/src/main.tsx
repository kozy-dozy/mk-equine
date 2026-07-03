import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import AppErrorBoundary from './components/AppErrorBoundary'
import { RootProviders } from './providers/RootProviders'
import { initGA } from './utils/analytics/googleAnalytics'
import { initSentry } from './utils/sentry'

import './index.css'

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
