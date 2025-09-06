import * as React from "react"
import { useIsFetching, useIsMutating } from "@tanstack/react-query"
import { useI18n } from "@/shared/hooks/useI18n"

type GlobalLoaderProps = {
    showOverlay?: boolean
    overlayDelayMs?: number
    className?: string
}

export function GlobalLoader({
                                 showOverlay = false,
                                 overlayDelayMs = 400,
                                 className,
                             }: GlobalLoaderProps) {
    const { t } = useI18n()

    const isFetching = useIsFetching()
    const isMutating = useIsMutating()
    const busy = isFetching + isMutating > 0

    const [overlayOn, setOverlayOn] = React.useState(false)

    React.useEffect(() => {
        if (!showOverlay) return
        let timer: number | undefined
        if (busy) {
            timer = window.setTimeout(() => setOverlayOn(true), overlayDelayMs)
        } else {
            setOverlayOn(false)
        }
        return () => {
            if (timer) window.clearTimeout(timer)
        }
    }, [busy, showOverlay, overlayDelayMs])

    return (
        <>
            {/* top progress bar */}
            <div
                aria-hidden
                className={`fixed left-0 top-0 z-[1000] h-0.5 w-full overflow-hidden bg-transparent ${className ?? ""}`}
                style={{ pointerEvents: "none" }}
            >
                <div
                    className={`h-full w-1/3 origin-left animate-[loadbar_1s_linear_infinite] ${
                        busy ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                        background: "var(--primary, #3b82f6)",
                        transition: "opacity 150ms ease",
                    }}
                />
            </div>

            {/* optional overlay */}
            {showOverlay && overlayOn && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]"
                >
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="sr-only">{t("loading")}</span>
                </div>
            )}

            <style>{`
        @keyframes loadbar {
          0%   { transform: translateX(-100%) scaleX(0.5); }
          50%  { transform: translateX(50%)   scaleX(1); }
          100% { transform: translateX(300%)  scaleX(0.5); }
        }
      `}</style>
        </>
    )
}
