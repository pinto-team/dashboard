// features/categories/model/tree.ts
import type { Category } from "./types";

/**
 * یک Map از id به نود می‌سازد (کپی ایمن با children: [])
 */
export function indexById(flat: Category[]): Map<string, Category> {
    const map = new Map<string, Category>();
    flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
    return map;
}

/**
 * لیست تخت را به درخت تبدیل می‌کند.
 * اگر parentId نامعتبر باشد یا موجود نباشد، آن نود به‌عنوان ریشه در نظر گرفته می‌شود.
 */
export function buildTree(flat: Category[]): Category[] {
    const map = indexById(flat);
    const roots: Category[] = [];

    map.forEach((node) => {
        if (node.parentId && map.has(node.parentId)) {
            const parent = map.get(node.parentId)!;
            parent.children!.push(node);
        } else {
            // ریشه
            node.parentId = null;
            roots.push(node);
        }
    });

    // اگر sort دارید، می‌توانید سورت هم‌سطح‌ها را انجام دهید:
    const sortSiblings = (nodes: Category[]) => {
        nodes.sort((a, b) => {
            const sa = a.sort ?? 0;
            const sb = b.sort ?? 0;
            if (sa !== sb) return sa - sb;
            return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
        });
        nodes.forEach((n) => n.children && sortSiblings(n.children));
    };
    sortSiblings(roots);

    return roots;
}

/**
 * تمام فرزندان (به‌صورت بازگشتی) را برمی‌گرداند.
 */
export function getDescendantsIds(node: Category): string[] {
    const out: string[] = [];
    (node.children || []).forEach((ch) => {
        out.push(ch.id, ...getDescendantsIds(ch));
    });
    return out;
}

/**
 * مسیر یک نود را از ریشه تا خود نود برمی‌گرداند (لیست id ها).
 * اگر پیدا نشد، null برمی‌گرداند.
 */
export function findPath(roots: Category[], targetId: string): string[] | null {
    const dfs = (nodes: Category[], path: string[]): string[] | null => {
        for (const n of nodes) {
            const next = [...path, n.id];
            if (n.id === targetId) return next;
            if (n.children?.length) {
                const found = dfs(n.children, next);
                if (found) return found;
            }
        }
        return null;
    };
    return dfs(roots, []);
}

/**
 * بررسی می‌کند آیا می‌توان والد یک نود را به newParentId تغییر داد یا خیر.
 * موارد غیرمجاز:
 *  - انتقال به خودش
 *  - انتقال به یکی از نوادگان خودش (ایجاد چرخه)
 */
export function canReparent(
    roots: Category[],
    nodeId: string,
    newParentId: string | null
): boolean {
    if (nodeId === newParentId) return false;
    // مسیر نود
    const path = findPath(roots, nodeId);
    if (!path) return false; // نود پیدا نشد
    // اگر newParentId یکی از نوادگان node باشد → چرخه
    if (newParentId) {
        const node = getNodeById(roots, nodeId);
        const descendants = node ? new Set(getDescendantsIds(node)) : new Set<string>();
        if (descendants.has(newParentId)) return false;
    }
    return true;
}

/**
 * پیدا کردن نود با id (به‌صورت عمقی)
 */
export function getNodeById(roots: Category[], id: string): Category | null {
    const stack = [...roots];
    while (stack.length) {
        const cur = stack.pop()!;
        if (cur.id === id) return cur;
        if (cur.children?.length) stack.push(...cur.children);
    }
    return null;
}

/**
 * یک کپی ایمن از درخت برمی‌گرداند (برای ایموتبیلیتی).
 */
export function cloneTree(roots: Category[]): Category[] {
    const cloneNode = (n: Category): Category => ({
        ...n,
        children: n.children ? n.children.map(cloneNode) : [],
    });
    return roots.map(cloneNode);
}

/**
 * حذف نود از درخت (بدون انتقال فرزندان).
 * خروجی: { tree, removed } که removed نود حذف‌شده است.
 */
export function removeNode(
    roots: Category[],
    nodeId: string
): { tree: Category[]; removed: Category | null } {
    const tree = cloneTree(roots);
    let removed: Category | null = null;

    const removeFrom = (nodes: Category[]): boolean => {
        const idx = nodes.findIndex((n) => n.id === nodeId);
        if (idx >= 0) {
            removed = nodes.splice(idx, 1)[0];
            return true;
        }
        for (const n of nodes) {
            if (n.children?.length && removeFrom(n.children)) return true;
        }
        return false;
    };

    // تلاش در ریشه‌ها
    const idxRoot = tree.findIndex((n) => n.id === nodeId);
    if (idxRoot >= 0) {
        removed = tree.splice(idxRoot, 1)[0];
        return { tree, removed };
    }

    removeFrom(tree);
    return { tree, removed };
}

/**
 * افزودن یک نود (به‌عنوان فرزند newParentId یا ریشه) — ایموتبیل.
 * newIndex اختیاری است برای تعیین جایگاه بین هم‌سطح‌ها.
 */
export function insertNode(
    roots: Category[],
    node: Category,
    newParentId: string | null,
    newIndex?: number
): Category[] {
    const tree = cloneTree(roots);

    if (!newParentId) {
        const arr = tree;
        if (newIndex === undefined || newIndex < 0 || newIndex > arr.length) {
            arr.push({ ...node, parentId: null });
        } else {
            arr.splice(newIndex, 0, { ...node, parentId: null });
        }
        return tree;
    }

    const parent = getNodeById(tree, newParentId);
    if (!parent) {
        // اگر والد پیدا نشد، به ریشه اضافه می‌کنیم
        const arr = tree;
        if (newIndex === undefined || newIndex < 0 || newIndex > arr.length) {
            arr.push({ ...node, parentId: null });
        } else {
            arr.splice(newIndex, 0, { ...node, parentId: null });
        }
        return tree;
    }

    parent.children = parent.children || [];
    if (newIndex === undefined || newIndex < 0 || newIndex > parent.children.length) {
        parent.children.push({ ...node, parentId: parent.id });
    } else {
        parent.children.splice(newIndex, 0, { ...node, parentId: parent.id });
    }
    return tree;
}

/**
 * جابه‌جایی نود به والد جدید (و انتخابی: جایگاه جدید بین هم‌سطح‌ها) — ایموتبیل.
 * برای DnD/Move کاربردی است.
 */
export function moveNode(
    roots: Category[],
    nodeId: string,
    newParentId: string | null,
    newIndex?: number
): Category[] {
    if (!canReparent(roots, nodeId, newParentId)) return roots;

    const { tree, removed } = removeNode(roots, nodeId);
    if (!removed) return roots;

    // parentId جدید
    removed.parentId = newParentId ?? null;
    return insertNode(tree, removed, newParentId, newIndex);
}

/**
 * به‌روزرسانی یک نود با patch (ایموتبیل)
 */
export function updateNode(
    roots: Category[],
    nodeId: string,
    patch: Partial<Omit<Category, "id" | "children">>
): Category[] {
    const tree = cloneTree(roots);
    const stack = [...tree];
    while (stack.length) {
        const cur = stack.pop()!;
        if (cur.id === nodeId) {
            Object.assign(cur, patch);
            break;
        }
        if (cur.children?.length) stack.push(...cur.children);
    }
    return tree;
}

/**
 * درخت را دوباره به لیست تخت تبدیل می‌کند (برای ارسال به سرور در برخی سناریوها).
 */
export function flattenTree(roots: Category[]): Category[] {
    const out: Category[] = [];
    const walk = (nodes: Category[], parentId: string | null) => {
        nodes.forEach((n, index) => {
            const { children, ...rest } = n;
            out.push({ ...rest, parentId, children: [] });
            if (children?.length) walk(children, n.id);
        });
    };
    walk(roots, null);
    return out;
}
