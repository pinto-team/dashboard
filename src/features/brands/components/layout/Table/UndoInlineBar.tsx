import * as React from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/shared/hooks/useI18n"

type Props = {
    durationMs?: number
    onUndo: () => void
    onTimeout: () => void
}

export default function UndoInlineBar({
                                          durationMs = 5000,
                                          onUndo,
                                          onTimeout,
                                      }: Props) {
    const { t } = useI18n()

    React.useEffect(() => {
        const id = setTimeout(onTimeout, durationMs)
        return () => clearTimeout(id)
    }, [durationMs, onTimeout])

    return (
        <div className="absolute inset-x-0 bottom-0 z-10 m-3 flex items-center justify-between rounded-lg border bg-background/95 p-3 shadow">
            <span className="text-sm">{t("common.deleted_temporarily")}</span>
            <Button size="sm" variant="outline" onClick={onUndo}>
                {t("common.undo")}
            </Button>
        </div>
    )
}
