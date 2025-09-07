// features/categories/components/layout/Tree/CategoryNode.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, ChevronDown, MoreVertical, Folder } from "lucide-react";
import type { Category } from "../../../model/types";

type Props = {
    node: Category;
    depth: number;
    expanded: boolean;
    /**
     * Sets the expanded state for a node by id. We pass this down so that
     * nested nodes can update their own expanded state without wrapping
     * callbacks for every level.
     */
    setExpanded: (id: string, v: boolean) => void;
    /** Called with the current node id when user requests to add a child */
    onAddChild: (parentId: string) => void;
    /** Called with the current node id when user wants to edit */
    onEdit: (id: string) => void;
    /** Called with the current node id when user wants to delete */
    onDelete: (id: string) => void;
    searchQuery?: string;
    /** Map of expanded states for quick lookup */
    expandedState: Record<string, boolean>;
};

export default function CategoryNode({
    node,
    depth,
    expanded,
    setExpanded,
    onAddChild,
    onEdit,
    onDelete,
    searchQuery,
    expandedState,
}: Props) {
    const hasChildren = !!node.children?.length;

    const highlightName = React.useMemo(() => {
        if (!searchQuery) return node.name;
        const q = searchQuery.toLowerCase();
        const idx = node.name.toLowerCase().indexOf(q);
        if (idx === -1) return node.name;
        const before = node.name.slice(0, idx);
        const match = node.name.slice(idx, idx + q.length);
        const after = node.name.slice(idx + q.length);
        return (
            <>
                {before}
                <span className="bg-yellow-200 dark:bg-yellow-900/40 rounded px-0.5">
          {match}
        </span>
                {after}
            </>
        );
    }, [node.name, searchQuery]);

    return (
        <li>
            {/* ردیف با گرید ثابت: دکمه/نام/اکشن */}
            <div
                className="grid items-center rounded hover:bg-muted/50"
                style={{
                    // عمق را روی container اعمال می‌کنیم تا تو رفتگی واقعی باشد
                    paddingInlineStart: depth * 14,
                    gridTemplateColumns: "28px minmax(0,1fr) auto",
                }}
            >
                {/* ستون ۱: Toggle یا Spacer */}
                <div className="flex items-center justify-center py-1">
                    {hasChildren ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setExpanded(node.id, !expanded)}
                            aria-label="toggle"
                        >
                            {expanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    ) : (
                        <span className="h-6 w-6" />
                    )}
                </div>

                {/* ستون ۲: آیکن + نام (truncate) */}
                <div className="flex items-center gap-2 py-1 min-w-0">
                    <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{highlightName}</span>
                </div>

                {/* ستون ۳: اکشن‌ها */}
                <div className="flex items-center justify-end py-1 pe-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="actions">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAddChild(node.id)}>
                                افزودن زیر‌دسته
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(node.id)}>
                                ویرایش
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => onDelete(node.id)}
                            >
                                حذف
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* کودکان */}
            {hasChildren && expanded && (
                <ul>
                    {node.children!.map((child) => (
                        <CategoryNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            expanded={expandedState[child.id] ?? false}
                            setExpanded={setExpanded}
                            onAddChild={onAddChild}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            searchQuery={searchQuery}
                            expandedState={expandedState}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}
