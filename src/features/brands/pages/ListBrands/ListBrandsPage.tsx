import * as React from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useListBrandsPage } from "./useListBrandsPage"
import { BrandsTableSkeleton, BrandsPaginationSkeleton } from "./Skeletons"
import { BrandsEmpty } from "./Empty"
import BrandsTable from "@/features/brands/components/layout/Table/BrandsTable"
import Pagination from "@/features/brands/components/ui/Pagination"
import ErrorFallback from "@/components/layout/ErrorFallback"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ListBrandsPage() {
    const {
        nav,
        i18n: { t },
        queryState,
        list,
        status,
        actions,
    } = useListBrandsPage()

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
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold">{t("brands.title")}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground [inset-inline-start:0.625rem]"
                            />
                            <Input
                                value={queryState.query}
                                onChange={(e) => {
                                    queryState.setQuery(e.target.value)
                                    queryState.setPage(0)
                                }}
                                placeholder={t("brands.search_placeholder") as string}
                                aria-label={t("brands.search_placeholder") as string}
                                className="w-72 [padding-inline-start:2rem]"
                            />
                        </div>

                        <Button onClick={() => nav.navigate(nav.ROUTES.BRAND.NEW)}>
                            {t("brands.create")}
                        </Button>
                    </div>
                </div>

                {subtitle && (
                    <div className="px-4 lg:px-6 -mt-2">
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                )}

                <div className="px-4 lg:px-6">
                    <div className={status.isFetching ? "relative" : ""}>
                        {status.isFetching && (
                            <div className="absolute inset-0 rounded-lg bg-background/40" />
                        )}
                        {content()}
                    </div>
                </div>

                {paginationNode && <div className="px-4 lg:px-6">{paginationNode}</div>}
            </div>
        </DashboardLayout>
    )
}
