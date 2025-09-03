// features/brands/pages/BrandsPage/UI.tsx
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BrandsTable from "@/features/brands/components/BrandsTable";
import type { BrandData } from "@/features/brands/model/types";

type PaginationProps = {
    page: number;
    pages: number;
    hasPrev: boolean;
    hasNext: boolean;
    disabled?: boolean;
    onFirst: () => void;
    onPrev: () => void;
    onNext: () => void;
    onLast: () => void;
};

type Props = {
    title: string;
    subtitle?: string;
    searchPlaceholder: string;
    query: string;
    onQueryChange: (v: string) => void;
    onAdd: () => void;
    items: BrandData[];
    onDelete: (id: string) => void;
    pagination: PaginationProps;
    isFetching?: boolean;
    labels: {
        first: string;
        prev: string;
        next: string;
        last: string;
    };
};

export default function BrandsPageUI({
                                         title,
                                         subtitle,
                                         searchPlaceholder,
                                         query,
                                         onQueryChange,
                                         onAdd,
                                         items,
                                         onDelete,
                                         pagination,
                                         isFetching = false,
                                         labels,
                                     }: Props) {
    const { page, pages, hasPrev, hasNext, disabled, onFirst, onPrev, onNext, onLast } = pagination;

    return (
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">{title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        className="w-72"
                    />
                    <Button onClick={onAdd}>{/* icon/text از ترجمه صفحه شما می‌آید */}{title}</Button>
                </div>
            </div>

            <div className="px-4 lg:px-6 -mt-2">
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <Separator className="mx-4 lg:mx-6" />

            <div className="px-4 lg:px-6">
                <div className={isFetching ? "relative" : ""}>
                    {isFetching && <div className="absolute inset-0 rounded-lg bg-background/40" />}
                    <BrandsTable items={items} onDelete={onDelete} />
                </div>
            </div>

            <div className="px-4 lg:px-6">
                <div className="flex flex-col items-center gap-3 p-3 sm:flex-row sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {`${
                            page + 1
                        } / ${pages}`}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onFirst} disabled={!hasPrev || !!disabled}>
                            {labels.first}
                        </Button>
                        <Button variant="outline" size="sm" onClick={onPrev} disabled={!hasPrev || !!disabled}>
                            {labels.prev}
                        </Button>
                        <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext || !!disabled}>
                            {labels.next}
                        </Button>
                        <Button variant="outline" size="sm" onClick={onLast} disabled={!hasNext || !!disabled}>
                            {labels.last}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
