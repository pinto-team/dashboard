// components/ui/global-loader.tsx
import * as React from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

type Props = {
    showOverlay?: boolean;
    overlayDelayMs?: number;
    className?: string;
};

export function GlobalLoader({
                                 showOverlay = false,
                                 overlayDelayMs = 400,
                                 className,
                             }: Props) {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const busy = isFetching + isMutating > 0;

    const [overlayOn, setOverlayOn] = React.useState(false);
    React.useEffect(() => {
        if (!showOverlay) return;
        let t: number | undefined;
        if (busy) t = window.setTimeout(() => setOverlayOn(true), overlayDelayMs);
        else setOverlayOn(false);
        return () => { if (t) window.clearTimeout(t); };
    }, [busy, showOverlay, overlayDelayMs]);

    return (
        <>
            {/* top progress bar */}
            <div
                aria-hidden
                className={`fixed left-0 top-0 h-0.5 w-full z-[1000] overflow-hidden bg-transparent ${className ?? ""}`}
                style={{ pointerEvents: "none" }}
            >
                <div
                    className={`h-full w-1/3 origin-left animate-[loadbar_1s_linear_infinite] ${
                        busy ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ background: "var(--primary, #3b82f6)", transition: "opacity 150ms ease" }}
                />
            </div>

            {/* optional overlay */}
            {showOverlay && overlayOn && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed inset-0 z-[999] bg-black/20 backdrop-blur-[1px] flex items-center justify-center"
                >
                    <div className="h-10 w-10 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    <span className="sr-only">Loading…</span>
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
    );
}
