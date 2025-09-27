// NestedDraggableList.tsx
import * as React from "react"
import {
    ChevronDown,
    ChevronRight,
    GripVertical,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InlineEditor from "./InlineEditor"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/app/routes/routes"
import { toAbsoluteUrl } from "@/shared/api/files"
import { useI18n } from "@/shared/hooks/useI18n"
import { useNestedCategories, CategoryNode, UUID } from "./useNestedCategories"
import { categoriesApiService } from "@/features/categories/services/categories.api"
import { toast } from "sonner"

export default function NestedDraggableList({
                                                searchQuery,
                                                onAddRoot,
                                                onCountChange,
                                            }: {
    searchQuery: string
    onAddRoot?: () => void
    onCountChange?: (count: number) => void
}) {
    const {
        categories,
        setCategories,
        loadingRoot,
        adding,
        startAddRoot: addCategory,
        startAddChild: addSubCategory,
        confirmAdd,
        cancelAdd,
        loadChildren,
        findAndUpdate,
        findChildrenRef,
        deepClone,
    } = useNestedCategories(onAddRoot, onCountChange)

    const { t, locale } = useI18n()
    const dir = locale === "fa" ? "rtl" : "ltr"
    const navigate = useNavigate()

    // --- Drag state ---
    const [draggedItem, setDraggedItem] = React.useState<{ item: CategoryNode; parentId: UUID | null } | null>(null)
    const [dragOverItem, setDragOverItem] = React.useState<{ item: CategoryNode; parentId: UUID | null } | null>(null)
    const expandTimer = React.useRef<number | null>(null)

    const toggleExpand = async (id: UUID) => {
        const next = deepClone(categories)
        const target = findAndUpdate(next, id, (n) => (n.expanded = !n.expanded))
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
        } catch {
            toast.error(t("common.error"))
        }
    }

    const handleDragStart = (e: React.DragEvent, item: CategoryNode, parentId: UUID | null) => {
        setDraggedItem({ item, parentId })
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", item.id)
    }
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }
    const handleDragEnter = (e: React.DragEvent, item: CategoryNode, parentId: UUID | null) => {
        e.preventDefault()
        setDragOverItem({ item, parentId })
        if (!item.expanded) {
            if (expandTimer.current) window.clearTimeout(expandTimer.current)
            expandTimer.current = window.setTimeout(() => toggleExpand(item.id), 350) as unknown as number
        }
    }

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
            toast.success(t("categories.deleted"))
        } catch {
            toast.error(t("common.error"))
        }
    }

    const renderCategory = (item: CategoryNode, level = 0, parentId: UUID | null = null): React.ReactNode => {
        const isBeingDragged = draggedItem?.item.id === item.id
        const isDragOver = dragOverItem?.item.id === item.id

        return (
            <div key={item.id} className="w-full">
                <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, parentId)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, item, parentId)}
                    className={`group flex items-center gap-2 p-2 rounded-lg transition-all cursor-move ${
                        isBeingDragged ? "opacity-50" : ""
                    } ${
                        isDragOver
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    style={{ marginRight: `${level * 32}px` }}
                >
                    <GripVertical className="w-4 h-4 text-gray-400" />

                    {/* expand button */}
                    <button
                        onClick={() => toggleExpand(item.id)}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                        {item.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {item.image_url && (
                        <img src={toAbsoluteUrl(item.image_url)} alt={item.name} className="h-6 w-6 rounded object-cover" />
                    )}

                    <span className="flex-1 text-sm font-medium">{item.name}</span>

                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                                e.stopPropagation()
                                addSubCategory(item.id)
                            }}
                            title={t("categories.create")}
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={t("common.more_actions")}
                                >
                                    <MoreVertical className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={6} onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuItem onClick={() => navigate(ROUTES.CATEGORY.EDIT(item.id))}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {t("categories.actions.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => deleteCategory(item.id, parentId)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t("categories.actions.delete")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Drop-zone برای تبدیل به فرزند */}
                <div
                    onDragOver={handleDragOver}
                    // ↓ اینجا می‌تونی تابع handleDropAsChild خودت رو اضافه کنی (از هوک هم می‌تونه بیاد)
                    className={
                        item.expanded
                            ? "mt-1 min-h-[20px]"
                            : "mt-1 h-2 opacity-0 group-hover:opacity-60 group-hover:h-5 transition-all"
                    }
                >
                    {item.expanded && item.children.map((child) => renderCategory(child, level + 1, item.id))}
                    {adding && adding.parentId === item.id && <InlineEditor onConfirm={confirmAdd} onCancel={cancelAdd} />}
                </div>
            </div>
        )
    }

    const filtered = React.useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return categories
        const match = (nodes: CategoryNode[]): CategoryNode[] =>
            nodes
                .map((n) => {
                    const kids = match(n.children)
                    const self = n.name.toLowerCase().includes(q)
                    return self || kids.length ? { ...n, expanded: true, children: kids } : null
                })
                .filter(Boolean) as CategoryNode[]
        return match(categories)
    }, [categories, searchQuery])

    return (
        <div className="w-full max-w-2xl mx-auto p-6" dir={dir}>
            <div className="space-y-2">
                {loadingRoot ? (
                    <div className="text-center py-8 text-gray-500">{t("common.loading")}</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">{t("common.no_results")}</div>
                ) : (
                    filtered.map((cat) => renderCategory(cat))
                )}
                {adding && adding.parentId === null && <InlineEditor onConfirm={confirmAdd} onCancel={cancelAdd} />}
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                {t("categories.help_drag_drop")}
            </div>

            {/* دکمه مخفی برای والد */}
            <button id="add-root-from-body" type="button" className="hidden" onClick={addCategory} />
        </div>
    )
}
