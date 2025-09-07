import { ChevronDown, ChevronRight, GripVertical, Plus, Search, Trash2 } from 'lucide-react'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'


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

export type CategoryNode = {
    id: string
    name: string
    expanded?: boolean
    children: CategoryNode[]
}

const initialData: CategoryNode[] = [
    {
        id: '1',
        name: 'دسته‌بندی اول',
        expanded: true,
        children: [
            { id: '1-1', name: 'زیردسته ۱.۱', children: [] },
            { id: '1-2', name: 'زیردسته ۱.۲', children: [] },
        ],
    },
    {
        id: '2',
        name: 'دسته‌بندی دوم',
        expanded: true,
        children: [
            { id: '2-1', name: 'زیردسته ۲.۱', children: [] },
            {
                id: '2-2',
                name: 'زیردسته ۲.۲',
                expanded: true,
                children: [{ id: '2-2-1', name: 'زیردسته ۲.۲.۱', children: [] }],
            },
        ],
    },
    {
        id: '3',
        name: 'دسته‌بندی سوم',
        expanded: false,
        children: [],
    },
]

function NestedDraggableList({
    searchQuery,
    onAddRoot,
    onCountChange,
}: {
    searchQuery: string
    onAddRoot?: () => void
    onCountChange?: (count: number) => void
}) {
    const [categories, setCategories] = React.useState<CategoryNode[]>(initialData)
    const [draggedItem, setDraggedItem] = React.useState<{
        item: CategoryNode
        parentId: string | null
    } | null>(null)
    const [dragOverItem, setDragOverItem] = React.useState<{
        item: CategoryNode
        parentId: string | null
    } | null>(null)

    const countNodes = React.useCallback(
        (nodes: CategoryNode[]): number =>
            nodes.reduce((acc, n) => acc + 1 + countNodes(n.children || []), 0),
        [],
    )

    React.useEffect(() => {
        onCountChange?.(countNodes(categories))
    }, [categories, countNodes, onCountChange])

    const addCategory = () => {
        const newId = Date.now().toString()
        setCategories((prev) => [
            ...prev,
            { id: newId, name: `دسته‌بندی جدید ${prev.length + 1}`, expanded: true, children: [] },
        ])
        onAddRoot?.()
    }

    const addSubCategory = (parentId: string) => {
        const add = (items: CategoryNode[]): boolean => {
            for (const it of items) {
                if (it.id === parentId) {
                    const newId = `${parentId}-${Date.now()}`
                    it.children = it.children || []
                    it.children.push({ id: newId, name: 'زیردسته جدید', children: [] })
                    it.expanded = true
                    return true
                }
                if (it.children && add(it.children)) return true
            }
            return false
        }
        const next = [...categories]
        add(next)
        setCategories(next)
    }

    const deleteCategory = (id: string, parentId: string | null = null) => {
        const remove = (items: CategoryNode[], currentParent: string | null): boolean => {
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
        const next = [...categories]
        remove(next, null)
        setCategories(next)
    }

    const toggleExpand = (id: string) => {
        const toggle = (items: CategoryNode[]): boolean => {
            for (const it of items) {
                if (it.id === id) {
                    it.expanded = !it.expanded
                    return true
                }
                if (it.children && toggle(it.children)) return true
            }
            return false
        }
        const next = [...categories]
        toggle(next)
        setCategories(next)
    }

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        item: CategoryNode,
        parentId: string | null = null,
    ) => {
        setDraggedItem({ item, parentId })
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDragEnter = (
        e: React.DragEvent,
        item: CategoryNode,
        parentId: string | null = null,
    ) => {
        e.preventDefault()
        setDragOverItem({ item, parentId })
    }

    const handleDrop = (
        e: React.DragEvent,
        targetItem: CategoryNode,
        targetParentId: string | null = null,
    ) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draggedItem || draggedItem.item.id === targetItem.id) return

        const newCategories: CategoryNode[] = JSON.parse(JSON.stringify(categories))

        const removeItem = (items: CategoryNode[], parentId: string | null): boolean => {
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

        const addItem = (items: CategoryNode[], parentId: string | null): boolean => {
            if (parentId === targetParentId) {
                const idx = items.findIndex((i) => i.id === targetItem.id)
                if (idx !== -1) {
                    items.splice(idx, 0, draggedItem.item)
                    return true
                }
            }
            for (const it of items) {
                if (it.children && addItem(it.children, it.id)) return true
            }
            return false
        }

        removeItem(newCategories, null)
        addItem(newCategories, null)
        setCategories(newCategories)
        setDraggedItem(null)
        setDragOverItem(null)
    }

    const handleDropAsChild = (e: React.DragEvent, parentItem: CategoryNode) => {
        e.preventDefault()
        e.stopPropagation()
        if (!draggedItem || draggedItem.item.id === parentItem.id) return

        const newCategories: CategoryNode[] = JSON.parse(JSON.stringify(categories))

        const removeItem = (items: CategoryNode[], parentId: string | null): boolean => {
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

        const addAsChild = (items: CategoryNode[]): boolean => {
            const parent = items.find((i) => i.id === parentItem.id)
            if (parent) {
                parent.children = parent.children || []
                parent.children.push(draggedItem.item)
                parent.expanded = true
                return true
            }
            for (const it of items) {
                if (it.children && addAsChild(it.children)) return true
            }
            return false
        }

        removeItem(newCategories, null)
        addAsChild(newCategories)
        setCategories(newCategories)
        setDraggedItem(null)
        setDragOverItem(null)
    }

    const renderCategory = (
        item: CategoryNode,
        level = 0,
        parentId: string | null = null,
    ): React.ReactNode => {
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
                    {hasChildren && (
                        <button
                            onClick={() => toggleExpand(item.id)}
                            className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                            {item.expanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>
                    )}
                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => addSubCategory(item.id)}
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                            onClick={() => deleteCategory(item.id, parentId)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
                {hasChildren && item.expanded && (
                    <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropAsChild(e, item)}
                        className="mt-1 min-h-[20px]"
                    >
                        {item.children.map((child) => renderCategory(child, level + 1, item.id))}
                    </div>
                )}
            </div>
        )
    }

    // فیلتر روی نام‌ها (والدهایی که فرزند مچ دارند حفظ می‌شوند)
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
            <div className="space-y-2">
                {filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">هیچ دسته‌بندی وجود ندارد</div>
                ) : (
                    filtered.map((cat) => renderCategory(cat))
                )}
            </div>
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                💡 راهنما: آیتم‌ها را بکشید و رها کنید تا جابجا شوند. برای تبدیل به زیردسته، روی
                دسته مورد نظر رها کنید.
            </div>
            {/* دکمه ایجاد ریشه (اختیاری در بدنه) */}
            <div className="mt-4 flex justify-center">
                <Button variant="secondary" onClick={addCategory}>
                    <Plus className="w-4 h-4 ml-2" /> افزودن دسته‌بندی ریشه
                </Button>
            </div>
        </Card>
    )
}

export default function CategorySamplePage() {
    const t = useT()
    const [query, setQuery] = React.useState('')
    const [count, setCount] = React.useState(0)

    const subtitle = count > 0 ? t('common.showing_count', { count }) : t('common.search_hint')

    const handleCreate = () => {
        const addBtn = document.getElementById('add-root-from-body')
        addBtn?.dispatchEvent(new Event('click', { bubbles: true }))
    }

    return (
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6" dir="rtl">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">{t('categories.title')}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground [inset-inline-start:0.625rem]"
                        />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('categories.search_placeholder')}
                            aria-label={t('categories.search_placeholder')}
                            className="w-72 [padding-inline-start:2rem]"
                        />
                    </div>

                    {/* دکمه ایجاد: در پروژه واقعی به مسیر ساخت کتگوری هدایت کنید */}
                    <Button onClick={handleCreate}>{t('categories.create')}</Button>
                </div>
            </div>

            {subtitle && (
                <div className="px-4 lg:px-6 -mt-2">
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
            )}

            <div className="px-4 lg:px-6">
                <NestedDraggableList
                    searchQuery={query}
                    onCountChange={setCount}
                    onAddRoot={() => {
                        /* قابل استفاده برای تلماتیک/آنالیتیکس */
                    }}
                />
            </div>
        </div>
    )
}