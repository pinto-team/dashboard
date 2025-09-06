import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useBrandsPageContainer } from "./Container"
import BrandsPageUI from "./Ui"
import { BrandsTableSkeleton, BrandsPaginationSkeleton } from "./Skeletons"
import { BrandsEmpty } from "./Empty"
import BrandsTable from "@/features/brands/components/layout/Table/BrandsTable"
import Pagination from "@/features/brands/components/ui/Pagination"
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

    const content = () => {
        if (status.isError) {
            return (
                <ErrorFallback
                    error={status.error}
                    onRetry={() => actions.refetch()}
                />
            )
        }

        if (status.isLoading) return <BrandsTableSkeleton />
        if (list.items.length === 0) return <BrandsEmpty />

        return <BrandsTable items={list.items} onDelete={actions.handleDelete} />
    }

    const paginationNode = status.isLoading ? (
        <BrandsPaginationSkeleton />
    ) : list.items.length > 0 ? (
        <Pagination
            page={queryState.page}
            pages={list.totalPages}
            hasPrev={list.hasPrev}
            hasNext={list.hasNext}
            disabled={status.isLoading}
            onFirst={actions.goFirst}
            onPrev={actions.goPrev}
            onNext={actions.goNext}
            onLast={actions.goLast}
            pageSize={queryState.pageSize}
            pageSizeOptions={[5, 10, 20, 30, 50]}
            onPageSizeChange={queryState.setPageSize}
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
    ) : null

    return (
        <DashboardLayout>
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
                isFetching={status.isFetching}
                pagination={paginationNode}
            >
                {content()}
            </BrandsPageUI>
        </DashboardLayout>
    )
}
