import { useMemo, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { productsQueries } from '@/features/products'
import type { ProductData } from '@/features/products/model/types'
import { ROUTES } from '@/app/routes/routes'
import useDebounced from '@/shared/hooks/useDebounced'
import { useI18n } from '@/shared/hooks/useI18n'
import type { PaginationProps } from '@/features/brands/components/ui/Pagination'

export function useListProductsPage() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(7)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query, 450)

  const listParams = useMemo(
    () => ({ page: page + 1, limit: pageSize, q: debouncedQuery }),
    [page, pageSize, debouncedQuery]
  )

  const { data, isLoading, isFetching, isError, error, refetch } =
    productsQueries.useList(listParams)

  const items: ProductData[] = data?.data ?? []
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

  const deleteMutation = productsQueries.useDelete()

  const handleDelete = useCallback(
    (id: string) => {
      const toDelete = items.find((x) => x.id === id) || null

      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success(t('products.deleted'))
          void refetch()
        },
        onError: () => {
          toast.error(t('common.error'))
        },
      })
    },
    [deleteMutation, items, refetch, t]
  )

  const goFirst = useCallback(() => setPage(0), [])
  const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), [])
  const goNext = useCallback(
    () => setPage((p) => Math.min(Math.max(0, totalPages - 1), p + 1)),
    [totalPages]
  )
  const goLast = useCallback(() => setPage(Math.max(0, (totalPages ?? 1) - 1)), [totalPages])

  const paginationProps: Omit<PaginationProps, 'labels'> = {
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

