import * as React from "react"
import TimeoutErrorPage from "@/components/layout/TimeoutErrorPage"
import { Button } from "@/components/ui/button"

type ErrorFallbackProps = {
    error: unknown            // 👈 به جای any
    onRetry: () => void
}

function isErrorWithMessage(err: unknown): err is { message?: string; code?: string } {
    return typeof err === "object" && err !== null && ("message" in err || "code" in err)
}

export default function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
    const msg =
        isErrorWithMessage(error) && typeof error.message === "string"
            ? error.message.toLowerCase()
            : ""

    const isTimeoutOrNetwork =
        (isErrorWithMessage(error) && error.code === "ECONNABORTED") ||
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
                    {isErrorWithMessage(error) && error.message
                        ? error.message
                        : "Unexpected error"}
                </p>
                <Button variant="outline" size="sm" onClick={onRetry}>
                    Retry
                </Button>
            </div>
        </div>
    )
}
