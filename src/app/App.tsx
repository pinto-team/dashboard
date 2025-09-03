// app/App.tsx
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "sonner";

function RouteFallback() {
    return (
        <div className="min-h-[50vh] grid place-items-center">
            <div className="h-8 w-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span className="sr-only">Loading route…</span>
        </div>
    );
}

export default function AppRoot() {
    return (
        <div className="scroll-container">
            {/* Snackbar container */}
            <Toaster position="top-center" richColors expand toastOptions={{ duration: 3500 }} />
            <div className="content-wrapper">
                <Suspense fallback={<RouteFallback />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    );
}
