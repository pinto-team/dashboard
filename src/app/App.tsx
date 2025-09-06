import { Toaster } from "sonner"
import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"

import AppErrorBoundary from "@/components/layout/AppErrorBoundary"

function RouteFallback() {
    const { t } = useTranslation()

    return (
        <div className="min-h-[50vh] grid place-items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span className="text-sm text-muted-foreground">
                {t("app.loading_route")}
            </span>
        </div>
    )
}

export default function AppRoot() {
    return (
        <div className="scroll-container">
            <Toaster
                position="bottom-center"
                richColors
                expand
                toastOptions={{ duration: 5000 }}
            />
            <div className="content-wrapper">
                <AppErrorBoundary>
                    <Suspense fallback={<RouteFallback />}>
                        <Outlet />
                    </Suspense>
                </AppErrorBoundary>
            </div>
        </div>
    )
}
