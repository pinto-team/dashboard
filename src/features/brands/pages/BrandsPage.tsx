/**
 * BrandsPage
 * -----------
 * لیست برندها با جستجو/صفحه‌بندی، حذف Optimistic و Undo بازگردانی
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
import { AppSidebar } from "@/features/sidebar/app-sidebar";

import BrandsTable from "@/features/brands/components/BrandsTable";
import { brandsQueries } from "@/features/brands";
import { useI18n } from "@/shared/hooks/useI18n";

import type { BrandData, CreateBrandRequest } from "@/features/brands/model/types";
import useDebounced from "@/shared/hooks/useDebounced";

export default function BrandsPage(): JSX.Element {
    const { t } = useI18n();
    const navigate = useNavigate();

    // جستجو + صفحه‌بندی
    const [page, setPage] = useState<number>(0);
    const [pageSize] = useState<number>(12);
    const [query, setQuery] = useState<string>("");

    const debouncedQuery = useDebounced(query, 450);

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

    // Mutations
    const deleteMutation = brandsQueries.useDelete();
    const createMutation = brandsQueries.useCreate(); // برای Undo

    const handleDelete = useCallback(
        (id: string) => {
            const toDelete = items.find((x) => x.id === id) || null;

            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast(t("brands.deleted"), {
                        action: {
                            label: t("common.undo"),
                            onClick: () => {
                                if (!toDelete) return;
                                const payload: CreateBrandRequest = {
                                    name: toDelete.name ?? "",
                                    description: (toDelete as any).description ?? "",
                                    country: (toDelete as any).country ?? "",
                                    website: (toDelete as any).website ?? "",
                                    logo_id: (toDelete as any).logo_id ?? undefined,
                                };
                                createMutation.mutate(payload, {
                                    onSuccess: () => {
                                        toast.success(t("common.restored"));
                                        void refetch();
                                    },
                                    onError: () => {
                                        toast.error(t("common.error"));
                                    },
                                });
                            },
                        },
                    });
                    void refetch();
                },
                onError: () => {
                    toast.error(t("common.error"));
                },
            });
        },
        [deleteMutation, items, refetch, t, createMutation]
    );


    // صفحه‌بندی
    const goFirst = useCallback(() => setPage(0), []);
    const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
    const goNext = useCallback(() => setPage((p) => p + 1), []);
    const goLast = useCallback(() => setPage(Math.max(0, (totalPages ?? 1) - 1)), [totalPages]);

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing)*72)",
                    "--header-height": "calc(var(--spacing)*12)",
                } as React.CSSProperties
            }
        >
            {/* ✅ برگرداندن سایدبار برای تثبیت لای‌اوت */}
            <AppSidebar variant="inset" />

            <SidebarInset>
                <SiteHeader />

                <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {/* Header + Actions */}
                    <div className="flex items-center justify-between px-4 lg:px-6">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold">{t("brands.title")}</h1>
                            <p className="text-sm text-muted-foreground">
                                {total > 0
                                    ? (t("common.showing_count", { count: total }) as string)
                                    : (t("common.search_hint") as string)}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Input
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setPage(0);
                                }}
                                placeholder={t("brands.search_placeholder") as string}
                                aria-label={t("brands.search_placeholder")}
                                className="w-72"
                            />
                            <Button onClick={() => navigate(ROUTES.BRAND.NEW)}>
                                {t("brands.add")}
                            </Button>
                        </div>
                    </div>

                    {/* ✅ Separator برای جدا کردن هدر از بادی */}
                    <Separator className="mx-4 lg:mx-6" />

                    {/* جدول */}
                    <div className="px-4 lg:px-6">
                        {isLoading ? (
                            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                                {t("common.loading")}
                            </div>
                        ) : isError ? (
                            <div className="flex items-center justify-between rounded-xl border p-4">
                                <div className="text-sm text-muted-foreground">{t("common.error")}</div>
                                <Button variant="outline" size="sm" onClick={() => refetch()}>
                                    {t("products.try_again")}
                                </Button>
                            </div>
                        ) : (
                            <BrandsTable
                                items={items}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="px-4 lg:px-6">
                        <div className="flex flex-col items-center gap-3 p-3 sm:flex-row sm:justify-between">
                            <div className="text-sm text-muted-foreground">
                                {t("pagination.page_of", { page: page + 1, pages: totalPages }) as string}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={goFirst} disabled={!hasPrev || isLoading}>
                                    {t("pagination.first")}
                                </Button>
                                <Button variant="outline" size="sm" onClick={goPrev} disabled={!hasPrev || isLoading}>
                                    {t("pagination.prev")}
                                </Button>
                                <Button variant="outline" size="sm" onClick={goNext} disabled={!hasNext || isLoading}>
                                    {t("pagination.next")}
                                </Button>
                                <Button variant="outline" size="sm" onClick={goLast} disabled={!hasNext || isLoading}>
                                    {t("pagination.last")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
