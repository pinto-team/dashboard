import * as React from 'react'
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { categoriesApiService } from '@/features/categories/services/categories.api'
import type { CategoryData } from '@/features/categories/model/types'
import InlineEditor from '@/features/categories/components/InlineEditor'

type UUID = string

// ---------- نوع درخت UI ----------
export type CategoryNode = {
    id: UUID
    name: string
    expanded?: boolean
    children: CategoryNode[]
}

// مپ دیتای API → نود UI
const toNode = (c: CategoryData): CategoryNode => ({
    id: c.id,
    name: c.name,
    expanded: false,
    children: [],
})

export default function NestedDraggableList({
                                                searchQuery,
                                                onAddRoot,
                                                onCountChange,
                                            }: {
    searchQuery: string
    onAddRoot?: () => void
    onCountChange?: (count: number) => void
}) {
    const [categories, setCategories] = React.useState<CategoryNode[]>([])
    const [draggedItem, setDraggedItem] = React.useState<{ item: CategoryNode; parentId: UUID | null } | null>(null)
    const [dragOverItem, setDragOverItem] = React.useState<{ item: CategoryNode; parentId: UUID | null } | null>(null)
    const [loadingRoot, setLoadingRoot] = React.useState(false)
    const [adding, setAdding] = React.useState<{ parentId: UUID | null } | null>(null)
    const expandTimer = React.useRef<number | null>(null)

    // ---------- بارگذاری ----------
    const loadChildren = React.useCallback(async (parentId: UUID | null) => {
        const res = await categoriesApiService.list({ parent_id: parentId ?? null, page: 1, limit: 100 })
        const list = res.data.data // asc by server
        return list.map(toNode)
    }, [])

    const loadRoot = React.useCallback(async () => {
        setLoadingRoot(true)
        try {
            const nodes = await loadChildren(null)
            setCategories(nodes)
        } catch (e: any) {
            toast.error(e?.response?.data?.detail?.[0]?.msg || 'خطا در بارگذاری دسته‌ها')
        } finally {
            setLoadingRoot(false)
        }
    }, [loadChildren])

    React.useEffect(() => {
        loadRoot()
    }, [loadRoot])

    // ---------- شمارش ----------
    const countNodes = React.useCallback(
        (nodes: CategoryNode[]): number => nodes.reduce((acc, n) => acc + 1 + countNodes(n.children || []), 0),
        [],
    )
    React.useEffect(() => {
        onCountChange?.(countNodes(categories))
    }, [categories, countNodes, onCountChange])

    // ---------- ابزارهای درخت ----------
    const findAndUpdate = (
        nodes: CategoryNode[],
        id: UUID,
        updater?: (n: CategoryNode) => void,
    ): CategoryNode | null => {
        for (const n of nodes) {
            if (n.id === id) {
                if (updater) updater(n)
                return n
            }
            if (n.children?.length) {
                const hit = findAndUpdate(n.children, id, updater)
                if (hit) return hit
            }
        }
        return null
    }

    const findAndGetChildrenRef = (
        nodes: CategoryNode[],
        parentId: UUID | null,
    ): CategoryNode[] | null => {
        if (parentId === null) return nodes
        for (const n of nodes) {
            if (n.id === parentId) return n.children
            const deeper = findAndGetChildrenRef(n.children || [], parentId)
            if (deeper) return deeper
        }
        return null
    }

    const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj))

    const isDescendant = (maybeAncestorId: UUID, maybeDescendantId: UUID, nodes: CategoryNode[]): boolean => {
        // آیا maybeDescendantId در زیرمجموعه‌ی maybeAncestorId است؟
        const stack: CategoryNode[] = [...nodes]
        while (stack.length) {
            const cur = stack.pop()!
            if (cur.id === maybeAncestorId) {
                const s: CategoryNode[] = [...(cur.children || [])]
                while (s.length) {
                    const x = s.pop()!
                    if (x.id === maybeDescendantId) return true
                    if (x.children?.length) s.push(...x.children)
                }
                return false
            }
            if (cur.children?.length) stack.push(...cur.children)
        }
        return false
    }

    // ---------- افزودن ----------
    const addCategory = () => setAdding({ parentId: null })
    const addSubCategory = (parentId: UUID) => setAdding({ parentId })

    const confirmAdd = async (name: string) => {
        if (!adding) return
        try {
            if (adding.parentId === null) {
                const order = categories.length
                const res = await categoriesApiService.create({ name, parent_id: null, order })
                const node = toNode(res.data.data)
                setCategories((prev) => [...prev, node])
                onAddRoot?.()
            } else {
                let next = deepClone(categories)
                let parentChildren = findAndGetChildrenRef(next, adding.parentId)
                if (parentChildren && parentChildren.length === 0) {
                    const fetched = await loadChildren(adding.parentId)
                    findAndUpdate(next, adding.parentId, (p) => (p.children = fetched))
                    parentChildren = findAndGetChildrenRef(next, adding.parentId)
                }
                const order = (parentChildren?.length ?? 0)
                const res = await categoriesApiService.create({
                    name,
                    parent_id: adding.parentId,
                    order,
                })
                parentChildren!.push(toNode(res.data.data))
                findAndUpdate(next, adding.parentId, (p) => (p.expanded = true))
                setCategories(next)
            }
            toast.success('ایجاد شد')
        } catch (e: any) {
            toast.error(e?.response?.data?.detail?.[0]?.msg || 'خطا در ایجاد')
        } finally {
            setAdding(null)
        }
    }

    const cancelAdd = () => setAdding(null)

    // ---------- حذف ----------
    const deleteCategory = async (id: UUID, parentId: UUID | null = null) => {
        const prev = categories
        try {
            await categoriesApiService.remove(id)
            const next = deepClone(prev)
            const remove = (items: CategoryNode[], currentParent: UUID | null): boolean => {
                if (currentParent === parentId) {
                    const index = items.findIndex((i) => i.id === id)
                    if (index !== -1) {
                        items.splice(index, 1)
                        return true
                    }
                }
                for (const it of items) {
                    if (it.children && remove(it.children, it.id)) return true
                }
                return false
            }
            remove(next, null)
            setCategories(next)
            toast.success('حذف شد')
        } catch (e: any) {
            toast.error(e?.response?.data?.detail?.[0]?.msg || 'خطا در حذف')
        }
    }

    // ---------- Expand (lazy-load) ----------
    const toggleExpand = async (id: UUID) => {
        const next = deepClone(categories)
        const target = findAndUpdate(next, id, (n) => {
            n.expanded = !n.expanded
        })
        setCategories(next)

        if (!target || !target.expanded) return
        if (target.children && target.children.length > 0) return

        try {
            const children = await loadChildren(target.id)
            setCategories((prev) => {
                const copy = deepClone(prev)
                const t = findAndUpdate(copy, id)
                if (t) {
                    t.children = children
                    t.expanded = true
                }
                return copy
            })
        } catch (e: any) {
            toast.error(e?.response?.data?.detail?.[0]?.msg || 'خطا در بارگذاری زیردسته‌ها')
        }
    }

    // ---------- Drag & Drop ----------
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: CategoryNode, parentId: UUID | null = null) => {
        setDraggedItem({ item, parentId })
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', item.id) // Firefox
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDragEnter = (e: React.DragEvent, item: CategoryNode, parentId: UUID | null = null) => {
        e.preventDefault()
        setDragOverItem({ item, parentId })

        // Auto-expand بعد از مکث کوتاه
        if (!item.expanded) {
            if (expandTimer.current) window.clearTimeout(expandTimer.current)
            expandTimer.current = window.setTimeout(() => {
                toggleExpand(item.id)
            }, 350) as unknown as number
        }
    }

    // جابه‌جایی «بین خواهر-برادرها» (قبل از target)
    const handleDrop = async (e: React.DragEvent, targetItem: CategoryNode, targetParentId: UUID | null = null) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draggedItem || draggedItem.item.id === targetItem.id) return

        // اگر مقصد، نواده‌ی آیتمِ درگ‌شده باشد و parent تغییر کند، از حلقه جلوگیری کن
        if (targetParentId && isDescendant(draggedItem.item.id, targetParentId, categories)) {
            setDraggedItem(null)
            setDragOverItem(null)
            return
        }

        const current = deepClone(categories)
        const targetSiblings = findAndGetChildrenRef(current, targetParentId)!
        const targetIndexBefore = targetSiblings.findIndex((i) => i.id === targetItem.id)

        const sourceSiblings = findAndGetChildrenRef(current, draggedItem.parentId)!
        const draggedIndexBefore = sourceSiblings.findIndex((i) => i.id === draggedItem.item.id)

        let insertIndex = targetIndexBefore
        if (draggedItem.parentId === targetParentId && draggedIndexBefore < targetIndexBefore) {
            insertIndex = Math.max(0, targetIndexBefore - 1)
        }

        const optimistic = deepClone(current)
        const draggedCopy = deepClone(draggedItem.item)

        const removeItem = (items: CategoryNode[], parentId: UUID | null): boolean => {
            if (parentId === draggedItem.parentId) {
                const index = items.findIndex((i) => i.id === draggedItem.item.id)
                if (index !== -1) {
                    items.splice(index, 1)
                    return true
                }
            }
            for (const it of items) {
                if (it.children && removeItem(it.children, it.id)) return true
            }
            return false
        }
        removeItem(optimistic, null)

        const insertAt = (items: CategoryNode[], parentId: UUID | null): boolean => {
            if (parentId === targetParentId) {
                items.splice(insertIndex, 0, draggedCopy)
                return true
            }
            for (const it of items) {
                if (it.children && insertAt(it.children, it.id)) return true
            }
            return false
        }
        insertAt(optimistic, null)

        setCategories(optimistic)
        setDraggedItem(null)
        setDragOverItem(null)

        try {
            await categoriesApiService.reorderOne(draggedItem.item.id, {
                parent_id: targetParentId ?? null,
                order: insertIndex,
            })
            toast.success('ترتیب به‌روزرسانی شد')
        } catch (err: any) {
            setCategories(current) // rollback
            toast.error(err?.response?.data?.detail?.[0]?.msg || 'خطا در جابه‌جایی')
        }
    }

    // جابه‌جایی «به‌عنوان فرزند»
    const handleDropAsChild = async (e: React.DragEvent, parentItem: CategoryNode) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draggedItem || draggedItem.item.id === parentItem.id) return

        // جلوگیری از دراپ داخل نواده‌ی خودش
        if (isDescendant(draggedItem.item.id, parentItem.id, categories)) {
            setDraggedItem(null)
            setDragOverItem(null)
            return
        }

        const current = deepClone(categories)
        let working = deepClone(current)
        const parentChildrenRef = findAndGetChildrenRef(working, parentItem.id)
        if (parentChildrenRef && parentChildrenRef.length === 0) {
            try {
                const fetched = await loadChildren(parentItem.id)
                findAndUpdate(working, parentItem.id, (p) => (p.children = fetched))
            } catch (e: any) {
                toast.error(e?.response?.data?.detail?.[0]?.msg || 'خطا در بارگذاری زیردسته‌ها')
                return
            }
        }

        const optimistic = deepClone(working)
        const draggedCopy = deepClone(draggedItem.item)

        const removeItem = (items: CategoryNode[], parentId: UUID | null): boolean => {
            if (parentId === draggedItem.parentId) {
                const index = items.findIndex((i) => i.id === draggedItem.item.id)
                if (index !== -1) {
                    items.splice(index, 1)
                    return true
                }
            }
            for (const it of items) {
                if (it.children && removeItem(it.children, it.id)) return true
            }
            return false
        }
        removeItem(optimistic, null)

        const childrenArr = findAndGetChildrenRef(optimistic, parentItem.id)!
        const newIndex = childrenArr.length
        childrenArr.push(draggedCopy)
        findAndUpdate(optimistic, parentItem.id, (p) => (p.expanded = true))

        setCategories(optimistic)
        setDraggedItem(null)
        setDragOverItem(null)

        try {
            await categoriesApiService.reorderOne(draggedItem.item.id, {
                parent_id: parentItem.id,
                order: newIndex,
            })
            toast.success('انتقال انجام شد')
        } catch (err: any) {
            setCategories(current)
            toast.error(err?.response?.data?.detail?.[0]?.msg || 'خطا در انتقال')
        }
    }

    // ---------- رندر ----------
    const renderCategory = (item: CategoryNode, level = 0, parentId: UUID | null = null): React.ReactNode => {
        const hasChildren = item.children && item.children.length > 0
        const isBeingDragged = draggedItem?.item.id === item.id
        const isDragOver = dragOverItem?.item.id === item.id

        return (
            <div key={item.id} className="w-full">
                <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, parentId)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, item, parentId)}
                    onDrop={(e) => handleDrop(e, item, parentId)}
                    className={`group flex items-center gap-2 p-2 rounded-lg transition-all cursor-move ${
                        isBeingDragged ? 'opacity-50' : ''
                    } ${
                        isDragOver
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    style={{ marginRight: `${level * 32}px` }}
                >
                    <GripVertical className="w-4 h-4 text-gray-400" />

                    {/* دکمه‌ی expand را همیشه نشان بده تا اجازه‌ی اولین expand داده شود */}
                    <button
                        onClick={() => toggleExpand(item.id)}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        title={item.expanded ? 'بستن' : 'باز کردن'}
                    >
                        {item.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <span className="flex-1 text-sm font-medium">{item.name}</span>

                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => addSubCategory(item.id)}
                            title="افزودن زیردسته"
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                            onClick={() => deleteCategory(item.id, parentId)}
                            title="حذف"
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                </div>

                {/* Drop-zone برای تبدیل به فرزند: همیشه رندر می‌شود */}
                <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropAsChild(e, item)}
                    className={
                        item.expanded
                            ? 'mt-1 min-h-[20px]'
                            : 'mt-1 h-2 opacity-0 group-hover:opacity-60 group-hover:h-5 transition-all'
                    }
                >
                    {/* اگر باز است، فرزندان را با تو‌رفتگی رندر کن */}
                    {item.expanded &&
                        item.children.map((child) => renderCategory(child, level + 1, item.id))}
                    {adding && adding.parentId === item.id && (
                        <InlineEditor onConfirm={confirmAdd} onCancel={cancelAdd} />
                    )}
                </div>
            </div>
        )
    }

    // ---------- فیلتر ----------
    const filtered = React.useMemo(() => {
        const q = searchQuery.trim()
        if (!q) return categories
        const matchTree = (nodes: CategoryNode[]): CategoryNode[] => {
            const res: CategoryNode[] = []
            for (const n of nodes) {
                const childrenMatched = matchTree(n.children || [])
                const selfMatched = n.name.toLowerCase().includes(q.toLowerCase())
                if (selfMatched || childrenMatched.length > 0) {
                    res.push({ ...n, expanded: true, children: childrenMatched })
                }
            }
            return res
        }
        return matchTree(categories)
    }, [categories, searchQuery])

    return (
        <div className="w-full max-w-2xl mx-auto p-6" dir="rtl">
            <div className="space-y-2">
                {loadingRoot ? (
                    <div className="text-center py-8 text-gray-500">در حال بارگذاری…</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">هیچ دسته‌بندی وجود ندارد</div>
                ) : (
                    filtered.map((cat) => renderCategory(cat))
                )}

                {adding && adding.parentId === null && (
                    <InlineEditor onConfirm={confirmAdd} onCancel={cancelAdd} />
                )}
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                💡 راهنما: آیتم‌ها را بکشید و رها کنید تا جابجا شوند. برای تبدیل به زیردسته، روی دستهٔ مورد نظر رها کنید.
            </div>

            {/* دکمه‌ی مخفی برای اتصال با صفحه‌ی والد (dispatchEvent) */}
            <button id="add-root-from-body" type="button" className="hidden" onClick={addCategory} />
        </div>
    )
}
