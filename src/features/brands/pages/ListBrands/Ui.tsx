import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Pagination, { PaginationProps } from "@/features/brands/components/ui/Pagination"
import type { BrandData } from "@/features/brands/model/types"
import BrandsTable from "@/features/brands/components/layout/Table/BrandsTable"
import { Search } from "lucide-react"

type Props = {
    title: string
    subtitle?: string
    searchPlaceholder: string
    brandsCreate: string
    query: string
    onQueryChange: (v: string) => void
    onAdd: () => void
    items: BrandData[]
    onDelete: (id: string) => void
    pagination: Omit<PaginationProps, "labels">
    isFetching?: boolean
    labels: PaginationProps["labels"]
}

export default function BrandsPageUI({
                                         title,
                                         subtitle,
                                         searchPlaceholder,
                                         brandsCreate,
                                         query,
                                         onQueryChange,
                                         onAdd,
                                         items,
                                         onDelete,
                                         pagination,
                                         isFetching = false,
                                         labels,
                                     }: Props) {
    return (
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">{title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground [inset-inline-start:0.625rem]"
                        />
                        <Input
                            value={query}
                            onChange={(e) => onQueryChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            aria-label={searchPlaceholder}
                            className="w-72 [padding-inline-start:2rem]"
                        />
                    </div>

                    <Button onClick={onAdd}>{brandsCreate}</Button>
                </div>
            </div>

            {subtitle && (
                <div className="px-4 lg:px-6 -mt-2">
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
            )}

            <div className="px-4 lg:px-6">
                <div className={isFetching ? "relative" : ""}>
                    {isFetching && <div className="absolute inset-0 rounded-lg bg-background/40" />}
                    <BrandsTable items={items} onDelete={onDelete} />
                </div>
            </div>

            <div className="px-4 lg:px-6">
                <Pagination {...pagination} disabled={isFetching} labels={labels} />
            </div>
        </div>
    )
}
