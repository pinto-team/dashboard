import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import AuthProvider from '@/app/providers/auth/AuthProvider.tsx'
import I18nProvider from '@/app/providers/i18n/I18nProvider.tsx'
import QueryProvider from '@/app/providers/query/QueryProvider.tsx'
import ThemeProvider from '@/app/providers/theme/ThemeProvider.tsx'
import { router } from '@/app/routes'
// Initialize i18n
import '@/shared/i18n/i18n'

import './index.css'

// Start the app after MSW is ready (if enabled)
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <I18nProvider>
                <AuthProvider>
                    <QueryProvider>
                        <RouterProvider router={router} />
                    </QueryProvider>
                </AuthProvider>
            </I18nProvider>
        </ThemeProvider>
    </StrictMode>,
)
