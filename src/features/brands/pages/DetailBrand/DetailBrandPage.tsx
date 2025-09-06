import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/sidebar/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import ErrorFallback from "@/components/layout/ErrorFallback"
import { useI18n } from "@/shared/hooks/useI18n"
import { toAbsoluteUrl } from "@/shared/api/files"
import { ROUTES } from "@/app/routes/routes"
import { brandsQueries } from "@/features/brands"

export default function DetailBrandPage() {
    const { id = "" } = useParams()
    const navigate = useNavigate()
    const { t } = useI18n()

    // 🔧 تغییر اصلی: useDetail به‌جای useRetrieve
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
                    <div className="px-4 lg:px-6 py-6">
                        <div className="grid gap-6 md:grid-cols-[280px,1fr]">
                            <div className="h-64 rounded-lg border bg-muted/30" />
                            <div className="space-y-4">
                                <div className="h-6 w-40 rounded bg-muted/30" />
                                <div className="h-4 w-64 rounded bg-muted/30" />
                                <div className="h-32 w-full rounded bg-muted/30" />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (isError) {
        return <ErrorFallback error={error} onRetry={() => refetch()} />
    }

    return (
        <SidebarProvider
            style={{ "--sidebar-width": "calc(var(--spacing)*72)", "--header-height": "calc(var(--spacing)*12)" } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                {!brand ? (
                    <div className="px-4 lg:px-6 py-10 text-sm text-muted-foreground">
                        {t("common.no_results")}
                    </div>
                ) : (
                    <div className="px-4 lg:px-6 py-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{brand.name}</h1>
                                {brand.country ? (
                                    <p className="text-sm text-muted-foreground">{brand.country}</p>
                                ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={goBack}>
                                    {t("common.back")}
                                </Button>
                                <Button onClick={goEdit}>{t("brands.actions.edit")}</Button>
                            </div>
                        </div>

                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/50">
                                <CardTitle className="text-base">
                                    {t("brands.details.title") ?? t("brands.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-6 md:grid-cols-[280px,1fr]">
                                    <div className="flex items-start justify-center">
                                        {brand.logo_url ? (
                                            <img
                                                src={toAbsoluteUrl(brand.logo_url)}
                                                alt={t("brands.logo_alt") as string}
                                                className="h-64 w-full max-w-64 rounded-lg object-contain border bg-background"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="h-64 w-full max-w-64 rounded-lg border bg-muted/30" />
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid gap-2">
                                            <span className="text-xs text-muted-foreground">{t("brands.table.name")}</span>
                                            <span className="font-medium">{brand.name || "-"}</span>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-2">
                                            <span className="text-xs text-muted-foreground">{t("brands.table.country")}</span>
                                            <span>{brand.country || "-"}</span>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-2">
                                            <span className="text-xs text-muted-foreground">{t("brands.table.website")}</span>
                                            {brand.website ? (
                                                <a
                                                    href={brand.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer external"
                                                    className="max-w-[42ch] truncate underline-offset-4 hover:underline"
                                                    title={brand.website}
                                                >
                                                    {brand.website}
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
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </SidebarInset>
        </SidebarProvider>
    )
}
