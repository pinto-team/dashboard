import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Category } from "../../../model/types";
import CategoryNode from "./CategoryNode";

// به هدر اجازه می‌دهیم توابع expand/collapse را صدا بزند
export type CategoryTreeHandle = {
    expandAll: () => void;
    collapseAll: () => void;
};

type Props = {
    items: Category[];                          // درخت آماده (buildTree)
    onAddChild: (parentId: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    searchQuery?: string;                       // جستجو از هدر
};

const EXPANDED_KEY = "cat.expanded";

function loadExpanded(): Record<string, boolean> {
    try {
        return JSON.parse(localStorage.getItem(EXPANDED_KEY) || "{}");
    } catch {
        return {};
    }
}
function saveExpanded(v: Record<string, boolean>) {
    localStorage.setItem(EXPANDED_KEY, JSON.stringify(v));
}

function walk(nodes: Category[], cb: (n: Category) => void) {
    nodes.forEach((n) => {
        cb(n);
        n.children?.length && walk(n.children, cb);
    });
}

function filterTree(items: Category[], query: string): Category[] {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    const clone = (n: Category): Category => ({
        ...n,
        children: n.children ? n.children.map(clone) : [],
    });

    const filterNode = (node: Category): Category | null => {
        const nameMatch = node.name.toLowerCase().includes(q);
        const children = (node.children || [])
            .map(filterNode)
            .filter(Boolean) as Category[];
        if (nameMatch || children.length) {
            const copy = clone(node);
            copy.children = children;
            return copy;
        }
        return null;
    };

    return items.map(filterNode).filter(Boolean) as Category[];
}

function collectIdsToExpandForQuery(items: Category[], query: string): Set<string> {
    const q = query.trim().toLowerCase();
    const ids = new Set<string>();
    if (!q) return ids;

    const dfs = (node: Category, ancestors: string[]) => {
        const match = node.name.toLowerCase().includes(q);
        if (match) ancestors.forEach((id) => ids.add(id));
        (node.children || []).forEach((ch) => dfs(ch, [...ancestors, node.id]));
    };

    items.forEach((root) => dfs(root, []));
    return ids;
}

const CategoryTree = React.forwardRef<CategoryTreeHandle, Props>(function CategoryTree(
    { items, onAddChild, onEdit, onDelete, searchQuery },
    ref
) {
    const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() => loadExpanded());

    const setExp = React.useCallback((id: string, v: boolean) => {
        setExpanded((prev) => {
            const next = { ...prev, [id]: v };
            saveExpanded(next);
            return next;
        });
    }, []);

    // پیش‌فرض: ریشه‌ها باز باشند (وقتی بار اول داده می‌آید)
    React.useEffect(() => {
        if (!items?.length) return;
        setExpanded((prev) => {
            if (Object.keys(prev).length) return prev;
            const next: Record<string, boolean> = {};
            items.forEach((r) => (next[r.id] = true));
            saveExpanded(next);
            return next;
        });
    }, [items]);

    // توابع عمومی برای هدر
    const expandAll = React.useCallback(() => {
        const next: Record<string, boolean> = {};
        walk(items, (n) => (next[n.id] = true));
        setExpanded(next);
        saveExpanded(next);
    }, [items]);

    const collapseAll = React.useCallback(() => {
        setExpanded({});
        saveExpanded({});
    }, []);

    React.useImperativeHandle(ref, () => ({ expandAll, collapseAll }), [expandAll, collapseAll]);

    // هنگام جستجو مسیر نتایج را باز کن
    React.useEffect(() => {
        if (!searchQuery) return;
        const idsToOpen = collectIdsToExpandForQuery(items, searchQuery);
        if (!idsToOpen.size) return;
        setExpanded((prev) => {
            const next = { ...prev };
            idsToOpen.forEach((id) => (next[id] = true));
            saveExpanded(next);
            return next;
        });
    }, [items, searchQuery]);

    const toRender = React.useMemo(
        () => (searchQuery ? filterTree(items, searchQuery) : items),
        [items, searchQuery]
    );

    // فریم‌لس: بدون Card/Separator؛ فقط لیست
    return (
        <div>
            <ScrollArea className="max-h-[70vh]">
                <ul className="pe-2">
                    {toRender.map((node) => (
                        <CategoryNode
                            key={node.id}
                            node={node}
                            depth={0}
                            expanded={expanded[node.id] ?? true}
                            setExpanded={(v) => setExp(node.id, v)}
                            onAddChild={() => onAddChild(node.id)}
                            onEdit={() => onEdit(node.id)}
                            onDelete={() => onDelete(node.id)}
                            searchQuery={searchQuery}
                            expandedState={expanded}
                        />
                    ))}
                </ul>
            </ScrollArea>
        </div>
    );
});

export default CategoryTree;
