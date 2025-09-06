import * as React from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogPortal,
    AlertDialogOverlay,
} from "@/components/ui/alert-dialog"

type ConfirmDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: React.ReactNode
    description?: React.ReactNode
    cancelLabel: string
    confirmLabel: string
    onConfirm: () => void | Promise<void>
    disabled?: boolean
    contentClassName?: string
    headerClassName?: string
    footerClassName?: string
    /** اگر true بدهی، قطعاً RTL می‌شود؛ در غیر این صورت از <html> حدس می‌زند */
    rtl?: boolean
}

export function ConfirmDialog({
                                  open,
                                  onOpenChange,
                                  title,
                                  description,
                                  cancelLabel,
                                  confirmLabel,
                                  onConfirm,
                                  disabled,
                                  contentClassName,
                                  headerClassName,
                                  footerClassName,
                                  rtl: rtlProp,
                              }: ConfirmDialogProps) {
    const rtl =
        rtlProp ??
        (typeof document !== "undefined" && (() => {
            const el = document.documentElement
            const dir = (el.getAttribute("dir") || "").toLowerCase()
            const lang = (el.getAttribute("lang") || "").toLowerCase()
            return dir === "rtl" || el.classList.contains("rtl") || lang.startsWith("fa")
        })())

    const handleConfirm = async () => {
        if (disabled) return
        await Promise.resolve(onConfirm())
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogPortal>
                <AlertDialogOverlay />
                <AlertDialogContent
                    dir={rtl ? "rtl" : "ltr"}
                    className={`${rtl ? "text-right" : ""} ${contentClassName ?? ""}`}
                >
                    <AlertDialogHeader
                        className={`${rtl ? "!text-right sm:!text-right" : ""} ${headerClassName ?? ""}`}
                    >
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        {description ? (
                            <AlertDialogDescription>{description}</AlertDialogDescription>
                        ) : null}
                    </AlertDialogHeader>

                    {/* Footer را reverse نکن؛ end همیشه راستِ بصری است */}
                    <AlertDialogFooter className={`${footerClassName ?? ""}`}>
                        <AlertDialogCancel disabled={disabled}>{cancelLabel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={disabled}>
                            {confirmLabel}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogPortal>
        </AlertDialog>
    )
}

export default ConfirmDialog
