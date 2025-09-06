import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export type PaginationProps = {
    page: number
    pages: number
    hasPrev: boolean
    hasNext: boolean
    disabled?: boolean
    onFirst: () => void
    onPrev: () => void
    onNext: () => void
    onLast: () => void
    labels: {
        first: string
        prev: string
        next: string
        last: string
        rowsPerPage: string
        page: string
        of: string
    }
    pageSize?: number
    pageSizeOptions?: number[]
    onPageSizeChange?: (size: number) => void
}

function useIsRTL() {
    const [rtl, setRtl] = React.useState(false)
    React.useEffect(() => {
        const el = document?.documentElement
        const update = () => setRtl(el?.getAttribute("dir") === "rtl")
        update()
        const obs = new MutationObserver(update)
        if (el) obs.observe(el, { attributes: true, attributeFilter: ["dir"] })
        return () => obs.disconnect()
    }, [])
    return rtl
}

export default function Pagination({
                                       page,
                                       pages,
                                       hasPrev,
                                       hasNext,
                                       disabled,
                                       onFirst,
                                       onPrev,
                                       onNext,
                                       onLast,
                                       labels,
                                       pageSize,
                                       pageSizeOptions = [10, 20, 30, 40, 50],
                                       onPageSizeChange,
                                   }: PaginationProps) {
    const isRTL = useIsRTL()

    const totalPages = Math.max(0, pages)
    const currentPage = totalPages === 0 ? 0 : Math.min(page + 1, totalPages)
    const allDisabled = !!disabled
    const showRowsPerPage = typeof pageSize === "number" && !!onPageSizeChange

    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-2">
                {showRowsPerPage && (
                    <>
                        <Label htmlFor="rows-per-page" className="hidden text-sm font-medium sm:inline">
                            {labels.rowsPerPage}
                        </Label>
                        <Select
                            value={`${pageSize}`}
                            onValueChange={(v) => onPageSizeChange?.(Number(v))}
                            disabled={allDisabled}
                        >
                            <SelectTrigger id="rows-per-page" size="sm" className="w-20">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {pageSizeOptions.map((ps) => (
                                    <SelectItem key={ps} value={`${ps}`}>
                                        {ps}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                )}
            </div>

            <div className="flex items-center gap-6">
                <div className="text-sm font-medium" aria-live="polite">
                    {labels.page} {currentPage} {labels.of} {totalPages}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={onFirst}
                        disabled={!hasPrev || allDisabled}
                        aria-label={labels.first}
                        title={labels.first}
                    >
                        <ChevronsLeft className={`h-4 w-4 ${isRTL ? "-scale-x-100" : ""}`} />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={onPrev}
                        disabled={!hasPrev || allDisabled}
                        aria-label={labels.prev}
                        title={labels.prev}
                    >
                        <ChevronLeft className={`h-4 w-4 ${isRTL ? "-scale-x-100" : ""}`} />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={onNext}
                        disabled={!hasNext || allDisabled}
                        aria-label={labels.next}
                        title={labels.next}
                    >
                        <ChevronRight className={`h-4 w-4 ${isRTL ? "-scale-x-100" : ""}`} />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={onLast}
                        disabled={!hasNext || allDisabled}
                        aria-label={labels.last}
                        title={labels.last}
                    >
                        <ChevronsRight className={`h-4 w-4 ${isRTL ? "-scale-x-100" : ""}`} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
