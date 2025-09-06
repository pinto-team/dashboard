import * as React from "react"
import TimeoutErrorPage from "@/components/layout/TimeoutErrorPage"
import { Button } from "@/components/ui/button"

export default function ErrorFallback({
                                          error,
                                          onRetry,
                                      }: {
    error: any
    onRetry: () => void
}) {
    const msg = error?.message?.toLowerCase?.() || ""

    const isTimeoutOrNetwork =
        error?.code === "ECONNABORTED" ||
        msg.includes("timeout") ||
        msg.includes("network error") ||
        msg.includes("failed to fetch") ||
        msg.includes("err_connection_refused")

    if (isTimeoutOrNetwork) {
        return <TimeoutErrorPage onRetry={onRetry} />
    }

    return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
            <div className="rounded-lg border p-6 text-center max-w-md">
                <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
                <p className="text-muted-foreground mb-4">
                    {error?.message || "Unexpected error"}
                </p>
                <Button variant="outline" size="sm" onClick={onRetry}>
                    Retry
                </Button>
            </div>
        </div>
    )
}
