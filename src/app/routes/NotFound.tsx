import { Link } from "react-router-dom"
import { useI18n } from "@/shared/hooks/useI18n"

export default function NotFound() {
    const { t } = useI18n()

    return (
        <div className="min-h-dvh grid place-items-center p-6 text-center">
            <div>
                <h1 className="mb-2 text-3xl font-bold">404</h1>
                <p className="mb-4 text-muted-foreground">{t("notFound.message")}</p>
                <Link
                    to="/"
                    className="inline-block rounded-md border px-3 py-2 hover:bg-muted/50"
                >
                    {t("notFound.goHome")}
                </Link>
            </div>
        </div>
    )
}
