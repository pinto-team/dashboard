import * as React from 'react'
import { ChevronDown, ChevronRight, GripVertical, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { categoriesApiService } from '@/features/categories/services/categories.api'
import type { CategoryData } from '@/features/categories/model/types'
import InlineEditor from '@/features/categories/components/InlineEditor'

type UUID = string

// ---------- i18n سبک نمونه‌ی خودت ----------
const useT = () => {
    const dict: Record<string, string> = {
        'categories.title': 'دسته‌بندی‌ها',
        'categories.search_placeholder': 'جستجوی دسته‌بندی...',
        'categories.create': 'ایجاد دسته‌بندی',
        'common.search_hint': 'برای یافتن دسته‌بندی‌ها جستجو کنید',
        'common.showing_count': 'نمایش {{count}} مورد',
    }
    return (k: string, opt?: any) => (dict[k] || k).replace('{{count}}', String(opt?.count ?? ''))
}

// ---------- نوع درخت UI (گرافیکی) ----------
export type CategoryNode = {
    id: UUID
    name: string
    expanded?: boolean
    children: CategoryNode[]
}

// کمک: مپ دیتای API → نود UI
const toNode = (c: CategoryData): CategoryNode => ({
    id: c.id,
    name: c.name,
    expanded: false,
    children: [],
})

// ---------- کامپوننت ----------
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

    // ---------- بارگذاری ریشه ----------
    const loadChildren = React.useCallback(async (parentId: UUID | null) => {
        const res = await categoriesApiService.list({ parent_id: parentId ?? null, page: 1, limit: 100 })
        const list = res.data.data // already sorted asc by server
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

    // ---------- شمارش کل نودها ----------
    const countNodes = React.useCallback(
        (nodes: CategoryNode[]): number => nodes.reduce((acc, n) => acc + 1 + countNodes(n.children || []), 0),
        [],
    )
    React.useEffect(() => {
        onCountChange?.(countNodes(categories))
    }, [categories, countNodes, onCountChange])

    // ---------- ابزارهای دستکاری درخت ----------
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

    // ---------- افزودن ----------
    const addCategory = () => {
        setAdding({ parentId: null })
    }

    const addSubCategory = (parentId: UUID) => {
        setAdding({ parentId })
    }

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
                const order = parentChildren!.length
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

    // ---------- Expand (با lazy-load فرزندها) ----------
// ---------- Expand (با lazy-load فرزندها) ----------
    const toggleExpand = async (id: UUID) => {
        // مرحله ۱: toggle و ست‌کردن state (بدون بارگیری)
        const next = deepClone(categories)
        const target = findAndUpdate(next, id, (n) => {
            n.expanded = !n.expanded
        })
        setCategories(next)

        // اگر پیدا نشد یا بسته شد، کاری نکن
        if (!target || !target.expanded) return

        // اگر قبلاً فرزندها لود شده‌اند، نیاز به درخواست نیست
        if (target.children && target.children.length > 0) return

        // مرحله ۲: بارگیری فرزندها و به‌روزرسانی state روی نسخه‌ی تازه
        try {
            const children = await loadChildren(target.id)
            setCategories((prev) => {
                const copy = deepClone(prev)
                const t = findAndUpdate(copy, id)
                if (t) {
                    t.children = children
                    t.expanded = true // باز بماند
                }
                return copy
            })
        } catch (e: any) {
            toast.error(e?.response?.data?.detail?.[0]?.msg || 'خطا در بارگذاری زیردسته‌ها')
        }
    }

    // ---------- Drag helpers ----------
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
    }

    // جابه‌جایی «بین خواهر-برادرها» (قبل از target)
    const handleDrop = async (e: React.DragEvent, targetItem: CategoryNode, targetParentId: UUID | null = null) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draggedItem || draggedItem.item.id === targetItem.id) return

        // محاسبه‌ی insertIndex با فیکس off-by-one
        const current = deepClone(categories)

        // آرایه‌ی مقصد قبل از حذف
        const targetSiblings = findAndGetChildrenRef(current, targetParentId)!
        const targetIndexBefore = targetSiblings.findIndex((i) => i.id === targetItem.id)

        // آرایه‌ی مبدا برای محاسبه‌ی draggedIndex
        const sourceSiblings = findAndGetChildrenRef(current, draggedItem.parentId)!
        const draggedIndexBefore = sourceSiblings.findIndex((i) => i.id === draggedItem.item.id)

        let insertIndex = targetIndexBefore
        if (draggedItem.parentId === targetParentId && draggedIndexBefore < targetIndexBefore) {
            insertIndex = Math.max(0, targetIndexBefore - 1)
        }

        // optimistic update محلی
        const optimistic = deepClone(current)
        // 1) remove از مبدا
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
        // 2) insert در مقصد با index محاسبه‌شده
        const insertAt = (items: CategoryNode[], parentId: UUID | null): boolean => {
            if (parentId === targetParentId) {
                items.splice(insertIndex, 0, draggedItem.item)
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

        // API: parent_id و order جدید
        try {
            await categoriesApiService.reorderOne(draggedItem.item.id, {
                parent_id: targetParentId ?? null,
                order: insertIndex,
            })
            toast.success('ترتیب به‌روزرسانی شد')
        } catch (err: any) {
            // rollback
            setCategories(current)
            toast.error(err?.response?.data?.detail?.[0]?.msg || 'خطا در جابه‌جایی')
        }
    }

    // جابه‌جایی «به‌عنوان فرزند» (append به انتهای فرزندهای parentItem)
    const handleDropAsChild = async (e: React.DragEvent, parentItem: CategoryNode) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draggedItem || draggedItem.item.id === parentItem.id) return

        const current = deepClone(categories)

        // اگر فرزندها هنوز لود نشده، اول بگیر
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

        // optimistic
        const optimistic = deepClone(working)
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

        // index = انتهای لیست فرزندان
        const childrenArr = findAndGetChildrenRef(optimistic, parentItem.id)!
        const newIndex = childrenArr.length
        childrenArr.push(draggedItem.item)
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

    // ---------- رندر یک آیتم ----------
    const renderCategory = (item: CategoryNode, level = 0, parentId: UUID | null = null): React.ReactNode => {
        const hasChildren = item.children && item.children.length > 0 // توجه: بعد از expand اول درست می‌شود
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
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all cursor-move ${
                        isBeingDragged ? 'opacity-50' : ''
                    } ${
                        isDragOver
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    style={{ marginRight: `${level * 32}px` }}
                >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    {/* نکته: برای اجازه‌ی expand اولیه، دکمه را همیشه نشان می‌دهیم */}
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

                {item.expanded && (
                    <div onDragOver={handleDragOver} onDrop={(e) => handleDropAsChild(e, item)} className="mt-1 min-h-[20px]">
                        {item.children.map((child) => renderCategory(child, level + 1, item.id))}
                        {adding && adding.parentId === item.id && (
                            <InlineEditor onConfirm={confirmAdd} onCancel={cancelAdd} />
                        )}
                    </div>
                )}
            </div>
        )
    }

    // ---------- فیلتر نمایش ----------
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
        <Card className="w-full max-w-2xl mx-auto p-6" dir="rtl">
            {/* سرچ و اکشن‌ها (مثل نمونه‌ی خودت) */}
            <div className="flex items-center justify-between mb-4">
                <div className="relative">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground [inset-inline-start:0.625rem]"
                    />
                    <Input
                        value={searchQuery}
                        readOnly
                        placeholder="جستجوی دسته‌بندی..."
                        aria-label="جستجوی دسته‌بندی..."
                        className="w-72 [padding-inline-start:2rem] opacity-80"
                        title="کنترل سرچ در والد مدیریت می‌شود"
                    />
                </div>
                <Button onClick={addCategory} id="add-root-from-body">ایجاد دسته‌بندی</Button>
            </div>

            {/* لیست */}
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

            {/* دکمه ایجاد ریشه (همانند نمونه) */}
            <div className="mt-4 flex justify-center">
                <Button variant="secondary" onClick={addCategory}>
                    <Plus className="w-4 h-4 ml-2" /> افزودن دسته‌بندی ریشه
                </Button>
            </div>
        </Card>
    )
}
