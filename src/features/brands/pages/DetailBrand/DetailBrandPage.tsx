import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/sidebar/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import ErrorFallback from "@/components/layout/ErrorFallback"
import { useI18n } from "@/shared/hooks/useI18n"
import { toAbsoluteUrl } from "@/shared/api/files"
import { ROUTES } from "@/app/routes/routes"
import { brandsQueries } from "@/features/brands"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { isRTLLocale } from "@/shared/i18n/utils"

export default function DetailBrandPage() {
    const { id = "" } = useParams()
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)

    const { data, isLoading, isError, error, refetch } = brandsQueries.useDetail(id)
    const brand = data?.data

    const goEdit = React.useCallback(() => {
        if (!brand?.id) return
        navigate(ROUTES.BRAND.EDIT(brand.id))
    }, [brand?.id, navigate])

    const goBack = React.useCallback(() => {
        navigate(ROUTES.BRAND.LIST)
    }, [navigate])

    if (isLoading) {
        return (
            <SidebarProvider
                style={{ "--sidebar-width": "calc(var(--spacing)*72)", "--header-height": "calc(var(--spacing)*12)" } as React.CSSProperties}
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded bg-muted/30" />
                                <div className="h-6 w-48 rounded bg-muted/30" />
                            </div>
                            <div className="h-9 w-24 rounded bg-muted/30" />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="h-80 rounded-lg border bg-muted/30" />
                            <div className="h-80 rounded-lg border bg-muted/30" />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (isError) {
        return <ErrorFallback error={error} onRetry={() => refetch()} />
    }

    if (!brand) {
        return (
            <SidebarProvider
                style={{ "--sidebar-width": "calc(var(--spacing)*72)", "--header-height": "calc(var(--spacing)*12)" } as React.CSSProperties}
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="px-4 lg:px-6 py-10 text-sm text-muted-foreground">{t("common.no_results")}</div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    return (
        <SidebarProvider
            style={{ "--sidebar-width": "calc(var(--spacing)*72)", "--header-height": "calc(var(--spacing)*12)" } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />

                <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="shadow-none"
                                onClick={goBack}
                                aria-label={t("common.back")}
                                title={t("common.back")}
                            >
                                {rtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                            </Button>
                            <h1 className="text-2xl font-bold tracking-tight">{t("brands.details.title")}</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button onClick={goEdit}>{t("brands.actions.edit")}</Button>
                        </div>
                    </div>

                    <Card className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="grid gap-8 md:grid-cols-2">
                                {/* Left: info fields */}
                                <div className="grid gap-5">
                                    <Field label={t("brands.table.name")} value={brand.name || "-"} />
                                    <Separator />
                                    <Field label={t("brands.table.country")} value={brand.country || "-"} />
                                    <Separator />
                                    <div className="grid gap-2">
                                        <span className="text-xs text-muted-foreground">{t("brands.table.website")}</span>
                                        {brand.website ? (
                                            <a
                                                href={brand.website}
                                                target="_blank"
                                                rel="noopener noreferrer external"
                                                className="inline-flex max-w-[48ch] items-center gap-1 truncate underline-offset-4 hover:underline"
                                                title={brand.website}
                                            >
                                                <span className="truncate">{brand.website}</span>
                                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                            </a>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </div>
                                    <Separator />
                                    <div className="grid gap-2">
                                        <span className="text-xs text-muted-foreground">{t("brands.form.description")}</span>
                                        <p className="whitespace-pre-wrap text-sm leading-6">{brand.description || "—"}</p>
                                    </div>
                                </div>

                                {/* Right: logo/image */}
                                <div className="flex items-start justify-center">
                                    {brand.logo_url ? (
                                        <img
                                            src={toAbsoluteUrl(brand.logo_url)}
                                            alt={t("brands.logo_alt") as string}
                                            className="h-72 w-full max-w-[360px] rounded-lg object-contain border bg-background"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="h-72 w-full max-w-[360px] rounded-lg border bg-muted/30" />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

function Field({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
    return (
        <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-medium break-words">{value}</span>
        </div>
    )
}
