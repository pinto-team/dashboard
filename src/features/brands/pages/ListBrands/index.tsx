import * as React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/sidebar/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { useBrandsPageContainer } from "./Container"
import BrandsPageUI from "./Ui"
import { BrandsBodySkeleton } from "./Skeletons"
import ErrorFallback from "@/components/layout/ErrorFallback"

export default function BrandsPage() {
    const {
        nav,
        i18n: { t },
        queryState,
        list,
        status,
        actions,
    } = useBrandsPageContainer()

    const subtitle =
        list.total > 0
            ? (t("common.showing_count", { count: list.total }) as string)
            : (t("common.search_hint") as string)

    const renderContent = () => {
        if (status.isLoading) return <BrandsBodySkeleton />

        if (status.isError) {
            return (
                <ErrorFallback
                    error={status.error}
                    onRetry={() => actions.refetch()}
                />
            )
        }

        return (
            <BrandsPageUI
                title={t("brands.title") as string}
                subtitle={subtitle}
                searchPlaceholder={t("brands.search_placeholder") as string}
                brandsCreate={t("brands.create") as string}
                query={queryState.query}
                onQueryChange={(v) => {
                    queryState.setQuery(v)
                    queryState.setPage(0)
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
                    pageSize: queryState.pageSize,
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    onPageSizeChange: queryState.setPageSize,
                }}
                isFetching={status.isFetching}
                labels={{
                    first: t("pagination.first") as string,
                    prev: t("pagination.prev") as string,
                    next: t("pagination.next") as string,
                    last: t("pagination.last") as string,
                    rowsPerPage: t("pagination.rowsPerPage") as string,
                    page: t("pagination.page") as string,
                    of: t("pagination.of") as string,
                }}
            />
        )
    }

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
                {renderContent()}
            </SidebarInset>
        </SidebarProvider>
    )
}
