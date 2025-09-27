import { useMemo, useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { brandsQueries } from "@/features/brands"
import type { BrandData, CreateBrandRequest } from "@/features/brands/model/types"
import { ROUTES } from "@/app/routes/routes"
import useDebounced from "@/shared/hooks/useDebounced"
import { useI18n } from "@/shared/hooks/useI18n"
import type { PaginationProps } from "@/features/brands/components/ui/Pagination"
import { cleanLocalizedField, cleanSocialLinks } from "@/shared/utils/localized"

export function useListBrandsPage() {
    const { t } = useI18n()
    const navigate = useNavigate()

    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(7)
    const [query, setQuery] = useState("")
    const debouncedQuery = useDebounced(query, 450)

    const listParams = useMemo(
        () => ({ page: page + 1, limit: pageSize, q: debouncedQuery }),
        [page, pageSize, debouncedQuery]
    )

    const { data, isLoading, isFetching, isError, error, refetch } =
        brandsQueries.useList(listParams)

    const items: BrandData[] = data?.data ?? []
    const pagination = data?.meta?.pagination
    const total = pagination?.total ?? items.length
    const totalPagesFromApi = pagination?.total_pages

    const totalPages = useMemo(
        () => Math.max(1, totalPagesFromApi ?? Math.ceil(total / pageSize)),
        [totalPagesFromApi, total, pageSize]
    )

    const hasPrev = pagination?.has_previous ?? page > 0
    const hasNext = pagination?.has_next ?? page + 1 < totalPages

    useEffect(() => {
        setPage(0)
    }, [debouncedQuery, pageSize])

    useEffect(() => {
        setPage((p) => Math.min(p, Math.max(0, totalPages - 1)))
    }, [totalPages])

    const deleteMutation = brandsQueries.useDelete()
    const createMutation = brandsQueries.useCreate()

    const handleDelete = useCallback(
        (id: string) => {
            const toDelete = items.find((x) => x.id === id) || null

            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast(t("brands.deleted"), {
                        action: {
                            label: t("common.undo"),
                            onClick: () => {
                                if (!toDelete) return

                                const sanitizedName = cleanLocalizedField(toDelete.name)
                                const payload: CreateBrandRequest = {
                                    name: sanitizedName && Object.keys(sanitizedName).length > 0
                                        ? sanitizedName
                                        : { en: toDelete.slug },
                                    slug: toDelete.slug,
                                    is_active: toDelete.is_active,
                                }

                                const description = cleanLocalizedField(toDelete.description ?? undefined)
                                if (description) {
                                    payload.description = description
                                }

                                if (toDelete.website_url) {
                                    payload.website_url = toDelete.website_url
                                }

                                if (toDelete.logo_id) {
                                    payload.logo_id = toDelete.logo_id
                                }

                                const social = cleanSocialLinks(toDelete.social_links ?? undefined)
                                if (social) {
                                    payload.social_links = social
                                }

                                createMutation.mutate(payload, {
                                    onSuccess: () => {
                                        toast.success(t("common.restored"))
                                        void refetch()
                                    },
                                    onError: () => {
                                        toast.error(t("common.error"))
                                    },
                                })
                            },
                        },
                    })

                    void refetch()
                },
                onError: () => {
                    toast.error(t("common.error"))
                },
            })
        },
        [createMutation, deleteMutation, items, refetch, t]
    )

    const goFirst = useCallback(() => setPage(0), [])
    const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), [])
    const goNext = useCallback(
        () => setPage((p) => Math.min(Math.max(0, totalPages - 1), p + 1)),
        [totalPages]
    )
    const goLast = useCallback(() => setPage(Math.max(0, (totalPages ?? 1) - 1)), [totalPages])

    const paginationProps: Omit<PaginationProps, "labels"> = {
        page,
        pages: totalPages,
        hasPrev,
        hasNext,
        onFirst: goFirst,
        onPrev: goPrev,
        onNext: goNext,
        onLast: goLast,
        pageSize,
        pageSizeOptions: [10, 12, 20, 30, 50],
        onPageSizeChange: setPageSize,
    }

    return {
        nav: { navigate, ROUTES },
        i18n: { t },
        queryState: { query, setQuery, page, setPage, pageSize, setPageSize },
        list: { items, total, totalPages, hasPrev, hasNext },
        status: { isLoading, isFetching, isError, error },
        actions: { refetch, handleDelete, goFirst, goPrev, goNext, goLast },
        ui: { pagination: paginationProps },
    }
}
