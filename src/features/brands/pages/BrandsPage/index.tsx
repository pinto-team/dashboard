// features/brands/pages/BrandsPage/index.tsx
import * as React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/sidebar/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { useBrandsPageContainer } from "./Container";
import BrandsPageUI from "./Ui";
import { BrandsBodySkeleton } from "./Skeletons";

export default function BrandsPage() {
    const { nav, i18n: { t }, queryState, list, status, actions } = useBrandsPageContainer();

    const subtitle =
        list.total > 0
            ? (t("common.showing_count", { count: list.total }) as string)
            : (t("common.search_hint") as string);

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing)*72)",
                    "--header-height": "calc(var(--spacing)*12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                {status.isLoading ? (
                    <BrandsBodySkeleton />
                ) : status.isError ? (
                    <div className="px-4 lg:px-6">
                        <div className="flex items-center justify-between rounded-xl border p-4">
                            <div className="text-sm text-muted-foreground">{t("common.error") as string}</div>
                            <button
                                className="inline-flex h-8 items-center rounded-md border px-3 text-sm"
                                onClick={() => actions.refetch()}
                            >
                                {t("products.try_again") as string}
                            </button>
                        </div>
                    </div>
                ) : (
                    <BrandsPageUI
                        title={t("brands.title") as string}
                        subtitle={subtitle}
                        searchPlaceholder={t("brands.search_placeholder") as string}
                        query={queryState.query}
                        onQueryChange={(v) => {
                            queryState.setQuery(v);
                            queryState.setPage(0);
                        }}
                        onAdd={() => nav.navigate(nav.ROUTES.BRAND.NEW)}
                        items={list.items}
                        onDelete={actions.handleDelete}
                        pagination={{
                            page: queryState.page,
                            pages: list.totalPages,
                            hasPrev: list.hasPrev,
                            hasNext: list.hasNext,
                            disabled: status.isLoading,
                            onFirst: actions.goFirst,
                            onPrev: actions.goPrev,
                            onNext: actions.goNext,
                            onLast: actions.goLast,
                        }}
                        isFetching={status.isFetching}
                        labels={{
                            first: t("pagination.first") as string,
                            prev: t("pagination.prev") as string,
                            next: t("pagination.next") as string,
                            last: t("pagination.last") as string,
                        }}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
