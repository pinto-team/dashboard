import * as React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/shared/hooks/useI18n"

export default function TimeoutErrorPage({ onRetry }: { onRetry: () => void }) {
    const { t } = useI18n()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center gap-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h1 className="text-2xl font-bold">{t("errors.timeout_title")}</h1>
            <p className="text-muted-foreground max-w-md">
                {t("errors.timeout_desc")}
            </p>
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
                <RefreshCw className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t("errors.retry")}
            </Button>
        </div>
    )
}
