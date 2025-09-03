/**
 * BrandsPage
 * -----------
 * لیست برندها با جستجو/صفحه‌بندی و لودر Skeleton + Snackbar برای خطاها (سراسری)
 */
import { toast } from "sonner";
import * as React from "react";
import { JSX, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/routes/routes";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/features/sidebar/app-sidebar";
import useDebounced from "@/shared/hooks/useDebounced";
import { useI18n } from "@/shared/hooks/useI18n";

import BrandsTable from "../components/BrandsTable";
import { brandsQueries } from "@/features/brands";

export default function BrandsPage(): JSX.Element {
    const { t } = useI18n();
    const navigate = useNavigate();

    const [page, setPage] = useState<number>(0); // 0-based UI page
    const [pageSize] = useState<number>(12);
    const [query, setQuery] = useState<string>("");

    const debouncedQuery = useDebounced(query, 450);

    // Build list params: convert UI page (0-based) to API page (1-based)
    const listParams = useMemo(
        () => ({ page: page + 1, limit: pageSize, q: debouncedQuery }),
        [page, pageSize, debouncedQuery]
    );
    const { data, isLoading, isError, refetch } = brandsQueries.useList(listParams);

    const items = data?.data ?? [];
    const pagination = data?.meta?.pagination;
    const total = pagination?.total ?? items.length;
    const totalPagesFromApi = pagination?.total_pages;
    const totalPages = useMemo<number>(
        () => Math.max(1, totalPagesFromApi ?? Math.ceil(total / pageSize)),
        [totalPagesFromApi, total, pageSize]
    );
    const hasPrev = pagination?.has_previous ?? page > 0;
    const hasNext = pagination?.has_next ?? page + 1 < totalPages;

    const deleteMutation = brandsQueries.useDelete();

    const layoutStyle = useMemo<React.CSSProperties>(
        () =>
            ({
                "--sidebar-width": "calc(var(--spacing)*72)",
                "--header-height": "calc(var(--spacing)*12)",
            }) as React.CSSProperties,
        []
    );

    const handleCreate = useCallback(() => {
        navigate(ROUTES.BRAND.NEW); // مسیر ساخت برند
    }, [navigate]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setPage(0); // Reset to first page when search changes
    }, []);

    const handleDelete = useCallback(
        (id: string) => {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast.success(t("brands.deleted") || t("common.success"));
                    void refetch();
                },
                onError: () => {
                    // خطاها به‌صورت toast سراسری نمایش داده می‌شن
                },
            });
        },
        [deleteMutation, refetch, t]
    );

    const goFirst = useCallback(() => setPage(0), []);
    const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
    const goNext = useCallback(() => setPage((p) => p + 1), []);
    const goLast = useCallback(() => setPage(totalPages - 1), [totalPages]);

    return (
        <SidebarProvider style={layoutStyle}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />

                <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {/* Header + Actions */}
                    <div className="flex items-center justify-between px-4 lg:px-6">
                        <div className="flex flex-col">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-7 w-40" />
                                    <Skeleton className="mt-2 h-4 w-64" />
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold">{t("brands.title")}</h1>
                                    <p className="text-sm text-muted-foreground">
                                        {total > 0
                                            ? t("common.showing_count", { count: total })
                                            : t("common.search_hint")}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-10 w-56" />
                                    <Skeleton className="h-10 w-28" />
                                </>
                            ) : (
                                <>
                                    <Input
                                        aria-label={t("brands.search_placeholder")}
                                        placeholder={t("brands.search_placeholder") as string}
                                        value={query}
                                        onChange={handleSearchChange}
                                    />
                                    <Button onClick={handleCreate}>{t("brands.create")}</Button>
                                </>
                            )}
                        </div>
                    </div>

                    <Separator className="mx-4 lg:mx-6" />

                    {/* Body */}
                    <div className="px-4 lg:px-6">
                        {isLoading ? (
                            // جدول Skeleton
                            <div className="rounded-xl border p-4 space-y-2">
                                {/* header mock */}
                                <div className="grid grid-cols-12 gap-3">
                                    <Skeleton className="h-6 col-span-3" />
                                    <Skeleton className="h-6 col-span-3" />
                                    <Skeleton className="h-6 col-span-3" />
                                    <Skeleton className="h-6 col-span-3" />
                                </div>
                                {/* rows */}
                                <div className="mt-2 space-y-2">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <Skeleton key={i} className="h-10 w-full" />
                                    ))}
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="flex items-center justify-between rounded-xl border p-4">
                                <div className="text-sm text-muted-foreground">
                                    مشکلی در دریافت لیست پیش آمد.
                                </div>
                                <Button variant="outline" size="sm" onClick={() => refetch()}>
                                    تلاش مجدد
                                </Button>
                            </div>
                        ) : (
                            <BrandsTable items={items} onDelete={handleDelete} />
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 pb-4 lg:px-6">
                        <div className="hidden lg:block text-sm text-muted-foreground" />
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goFirst}
                                disabled={!hasPrev || isLoading}
                                aria-label={t("pagination.first")}
                                title={t("pagination.first") as string}
                            >
                                {t("pagination.first")}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goPrev}
                                disabled={!hasPrev || isLoading}
                                aria-label={t("pagination.prev")}
                                title={t("pagination.prev") as string}
                            >
                                {t("pagination.prev")}
                            </Button>
                            <div className="text-sm">
                                {t("pagination.page_of", { page: page + 1, pages: totalPages })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goNext}
                                disabled={!hasNext || isLoading}
                                aria-label={t("pagination.next")}
                                title={t("pagination.next") as string}
                            >
                                {t("pagination.next")}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goLast}
                                disabled={!hasNext || isLoading}
                                aria-label={t("pagination.last")}
                                title={t("pagination.last") as string}
                            >
                                {t("pagination.last")}
                            </Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
