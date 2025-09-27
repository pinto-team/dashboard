// features/categories/components/useNestedCategories.ts
import * as React from "react"
import { toast } from "sonner"
import { categoriesApiService } from "@/features/categories/services/categories.api"
import type { CategoryData } from "@/features/categories/model/types"
import { useI18n } from "@/shared/hooks/useI18n"

export type UUID = string

export type CategoryNode = {
    id: UUID
    name: string
    image_url: string | null
    expanded?: boolean
    children: CategoryNode[]
}

const toNode = (c: CategoryData): CategoryNode => ({
    id: c.id,
    name: c.name,
    image_url: c.image_url,
    expanded: false,
    children: [],
})

export function useNestedCategories(onAddRoot?: () => void, onCountChange?: (count: number) => void) {
    const [categories, setCategories] = React.useState<CategoryNode[]>([])
    const [loadingRoot, setLoadingRoot] = React.useState(false)
    const [adding, setAdding] = React.useState<{ parentId: UUID | null } | null>(null)
    const { t } = useI18n()

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
    const loadChildren = React.useCallback(async (parentId: UUID | null) => {
        const res = await categoriesApiService.list({ parent_id: parentId ?? undefined, page: 1, limit: 100 })
        return res.data.data.filter((c) => c.parent_id === parentId).map(toNode)
    }, [])

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

    const confirmAdd = async (name: string) => {
        if (!adding) return
        try {
            if (adding.parentId === null) {
                const res = await categoriesApiService.create({ name, parent_id: null, order: categories.length })
                setCategories((prev) => [...prev, toNode(res.data.data)])
                onAddRoot?.()
            } else {
                const next = deepClone(categories)
                let parentChildren = findChildrenRef(next, adding.parentId)
                if (parentChildren && parentChildren.length === 0) {
                    const fetched = await loadChildren(adding.parentId)
                    findAndUpdate(next, adding.parentId, (p) => (p.children = fetched))
                    parentChildren = findChildrenRef(next, adding.parentId)
                }
                const order = parentChildren?.length ?? 0
                const res = await categoriesApiService.create({ name, parent_id: adding.parentId, order })
                parentChildren!.push(toNode(res.data.data))
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
    }
}
