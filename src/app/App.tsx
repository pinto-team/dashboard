// app/App.tsx
import { Toaster } from 'sonner'

import { Suspense } from 'react'

import { Outlet } from 'react-router-dom'





function RouteFallback() {
    return (
        <div className="min-h-[50vh] grid place-items-center">
            <div className="h-8 w-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span className="sr-only">Loading route…</span>
        </div>
    )
}

export default function AppRoot() {
    return (
        <div className="scroll-container">
            {/* Snackbar container */}
            <Toaster
                position="bottom-center"
                richColors
                expand
                toastOptions={{ duration: 5000 }}
            />
            <div className="content-wrapper">
                <Suspense fallback={<RouteFallback />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    )
}
