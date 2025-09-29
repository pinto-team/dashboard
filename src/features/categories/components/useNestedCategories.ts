// features/categories/components/useNestedCategories.ts
import * as React from 'react'
import { toast } from 'sonner'

import { categoriesApiService } from '@/features/categories/services/categories.api'
import type { CategoryData, CreateCategoryRequest } from '@/features/categories/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { getLocalizedValue } from '@/shared/utils/localized'
import { slugify } from '@/shared/utils/slug'

export type UUID = string

export type CategoryNode = {
    id: UUID
    name: string
    image_url: string | null
    expanded?: boolean
    sort_index: number
    children: CategoryNode[]
}

export type ReorderParams = {
    sourceId: UUID
    fromParentId: UUID | null
    toParentId: UUID | null
    toIndex: number
}

export type ReorderPlan = {
    tree: CategoryNode[]
    fromParentId: UUID | null
    toParentId: UUID | null
    sourceSiblings: CategoryNode[]
    targetSiblings: CategoryNode[]
}

const extractImagePath = (category: CategoryData): string | null => {
    const legacy = (category as { image_url?: string | null }).image_url
    return legacy ?? category.image ?? null
}

export function useNestedCategories(onAddRoot?: () => void, onCountChange?: (count: number) => void) {
    const [categories, setCategories] = React.useState<CategoryNode[]>([])
    const [loadingRoot, setLoadingRoot] = React.useState(false)
    const [adding, setAdding] = React.useState<{ parentId: UUID | null } | null>(null)
    const { t, locale } = useI18n()

    const toNode = React.useCallback(
        (category: CategoryData): CategoryNode => ({
            id: category.id,
            name: getLocalizedValue(category.name, locale),
            image_url: extractImagePath(category),
            expanded: false,
            sort_index: category.sort_index,
            children: [],
        }),
        [locale],
    )

    // ----- helpers -----
    const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj))
    const findAndUpdate = (nodes: CategoryNode[], id: UUID, updater?: (n: CategoryNode) => void): CategoryNode | null => {
        for (const n of nodes) {
            if (n.id === id) {
                updater?.(n)
                return n
            }
            if (n.children?.length) {
                const hit = findAndUpdate(n.children, id, updater)
                if (hit) return hit
            }
        }
        return null
    }
    const findChildrenRef = (nodes: CategoryNode[], parentId: UUID | null): CategoryNode[] | null => {
        if (parentId === null) return nodes
        for (const n of nodes) {
            if (n.id === parentId) return n.children
            const deeper = findChildrenRef(n.children, parentId)
            if (deeper) return deeper
        }
        return null
    }

    // ----- load -----
    const fetchAllCategories = React.useCallback(async () => {
        const pageSize = 100
        let offset = 0
        const aggregated: CategoryData[] = []

        while (true) {
            const response = await categoriesApiService.list({ offset, limit: pageSize })
            const payload = response.data
            const items = payload?.data ?? []
            if (items.length === 0) {
                break
            }

            aggregated.push(...items)

            const total = payload?.meta?.pagination?.total
            offset += items.length

            if (typeof total === 'number' && total > 0) {
                if (aggregated.length >= total) {
                    break
                }
            } else if (items.length < pageSize) {
                break
            }
        }

        return aggregated
    }, [])

    const loadChildren = React.useCallback(
        async (parentId: UUID | null) => {
            const list = await fetchAllCategories()
            return list
                .filter((c) => c.parent_id === parentId)
                .sort((a, b) => a.sort_index - b.sort_index)
                .map(toNode)
        },
        [fetchAllCategories, toNode],
    )

    const hasLoadedRef = React.useRef(false)

    const loadRoot = React.useCallback(async () => {
        setLoadingRoot(true)
        try {
            const nodes = await loadChildren(null)
            setCategories(nodes)
        } catch {
            toast.error(t("common.error"))
        } finally {
            setLoadingRoot(false)
        }
    }, [loadChildren, t])

    React.useEffect(() => {
        if (hasLoadedRef.current) return
        hasLoadedRef.current = true
        loadRoot()
    }, [loadRoot])

    // ----- count -----
    const countNodes = React.useCallback(
        (nodes: CategoryNode[]): number => nodes.reduce((acc, n) => acc + 1 + countNodes(n.children || []), 0),
        []
    )
    React.useEffect(() => {
        onCountChange?.(countNodes(categories))
    }, [categories, countNodes, onCountChange])

    // ----- add -----
    const startAddRoot = () => setAdding({ parentId: null })
    const startAddChild = (pid: UUID) => {
        setAdding({ parentId: pid })
        setCategories((prev) => {
            const next = deepClone(prev)
            findAndUpdate(next, pid, (p) => (p.expanded = true))
            return next
        })
    }

    const confirmAdd = async (rawName: string) => {
        if (!adding) return
        try {
            const trimmedName = rawName.trim()
            if (!trimmedName) {
                toast.error(t('validation.required'))
                return
            }

            const localizedName = { 'en-US': trimmedName, 'fa-IR': trimmedName }
            const payload: CreateCategoryRequest = {
                name: localizedName,
                slug: slugify(trimmedName, 'category'),
                is_active: true,
                sort_index:
                    adding.parentId === null
                        ? categories.length
                        : findChildrenRef(categories, adding.parentId)?.length ?? 0,
            }

            if (adding.parentId) {
                payload.parent_id = adding.parentId
            }

            const res = await categoriesApiService.create(payload)
            const created = res.data.data

            if (adding.parentId === null) {
                if (created) {
                    setCategories((prev) => [...prev, toNode(created)])
                } else {
                    const refreshed = await loadChildren(null)
                    setCategories(refreshed)
                }
                onAddRoot?.()
            } else {
                const next = deepClone(categories)
                let parentChildren = findChildrenRef(next, adding.parentId)
                if (!parentChildren) {
                    parentChildren = []
                    findAndUpdate(next, adding.parentId, (p) => (p.children = parentChildren!))
                }
                if (parentChildren.length === 0) {
                    const fetched = await loadChildren(adding.parentId)
                    findAndUpdate(next, adding.parentId, (p) => (p.children = fetched))
                    parentChildren = findChildrenRef(next, adding.parentId)
                }

                if (created) {
                    parentChildren!.push(toNode(created))
                } else {
                    const refreshed = await loadChildren(adding.parentId)
                    findAndUpdate(next, adding.parentId, (p) => (p.children = refreshed))
                    parentChildren = findChildrenRef(next, adding.parentId)
                }

                findAndUpdate(next, adding.parentId, (p) => (p.expanded = true))
                setCategories(next)
            }
            toast.success(t("common.success"))
        } catch {
            toast.error(t("common.error"))
        } finally {
            setAdding(null)
        }
    }
    const cancelAdd = () => setAdding(null)

    return {
        categories,
        setCategories,
        loadingRoot,
        adding,
        startAddRoot,
        startAddChild,
        confirmAdd,
        cancelAdd,
        loadChildren,
        findAndUpdate,
        findChildrenRef,
        deepClone,
        createReorderPlan: (params: ReorderParams): ReorderPlan | null => {
            const next = deepClone(categories)
            const sourceSiblings = findChildrenRef(next, params.fromParentId)
            if (!sourceSiblings) return null

            const currentIndex = sourceSiblings.findIndex((child) => child.id === params.sourceId)
            if (currentIndex === -1) return null

            const [moved] = sourceSiblings.splice(currentIndex, 1)

            const targetSiblings =
                params.fromParentId === params.toParentId
                    ? sourceSiblings
                    : findChildrenRef(next, params.toParentId)

            if (!targetSiblings) return null

            let insertAt = params.toIndex
            if (params.fromParentId === params.toParentId && insertAt > currentIndex) {
                insertAt -= 1
            }
            insertAt = Math.max(0, Math.min(insertAt, targetSiblings.length))

            targetSiblings.splice(insertAt, 0, moved)

            const normalize = (nodes: CategoryNode[]) => {
                nodes.forEach((node, index) => {
                    node.sort_index = index
                })
            }

            normalize(sourceSiblings)
            if (targetSiblings !== sourceSiblings) {
                normalize(targetSiblings)
            }

            return {
                tree: next,
                fromParentId: params.fromParentId,
                toParentId: params.toParentId,
                sourceSiblings,
                targetSiblings,
            }
        },
    }
}
