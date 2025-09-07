import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useListCategoriesPage } from "./useListCategoriesPage";
import ErrorFallback from "@/components/layout/ErrorFallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minimize2, Maximize2 } from "lucide-react";

import CategoryTree, {
    CategoryTreeHandle,
} from "@/features/categories/components/layout/Tree/CategoryTree";
import { buildTree } from "@/features/categories/model/tree";

export default function ListCategoriesPage() {
    const {
        nav,
        i18n: { t },
        queryState,
        list,
        status,
        actions,
    } = useListCategoriesPage();

    const tree = React.useMemo(() => buildTree(list.items ?? []), [list.items]);

    const subtitle =
        list.total > 0
            ? (t("common.showing_count", { count: list.total }) as string)
            : (t("common.search_hint") as string);

    // هندلرها
    const handleAddRoot = () => {
        nav.navigate(nav.ROUTES.CATEGORY.NEW);
    };
    const handleAddChild = (parentId: string) => {
        nav.navigate(`${nav.ROUTES.CATEGORY.NEW}?parentId=${parentId}`);
    };
    const handleEdit = (id: string) => {
        nav.navigate(nav.ROUTES.CATEGORY.EDIT(id));
    };
    const handleDelete = (id: string) => {
        actions.handleDelete(id);
    };

    // ref برای کنترل درخت از هدر
    const treeRef = React.useRef<CategoryTreeHandle>(null);

    const content = () => {
        if (status.isError) {
            return (
                <ErrorFallback error={status.error} onRetry={() => actions.refetch()} />
            );
        }
        if (status.isLoading) return <div>{t("common.loading")}</div>;
        if (!list.items.length) return <div>{t("common.no_results")}</div>;

        return (
            <CategoryTree
                ref={treeRef}
                items={tree}
                onAddChild={handleAddChild}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchQuery={queryState.query}
            />
        );
    };

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* Header با تمام کنترل‌ها */}
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <h1 className="text-2xl font-bold">{t("categories.title")}</h1>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground [inset-inline-start:0.625rem]"
                            />
                            <Input
                                value={queryState.query}
                                onChange={(e) => queryState.setQuery(e.target.value)}
                                placeholder={t("categories.search_placeholder") as string}
                                aria-label={t("categories.search_placeholder") as string}
                                className="w-72 [padding-inline-start:2rem]"
                            />
                        </div>

                        {/* Expand/Collapse all */}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => treeRef.current?.collapseAll()}
                            title={t("common.collapse_all") as string}
                        >
                            <Minimize2 className="me-1 h-4 w-4" />
                            {t("common.collapse_all") as string}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => treeRef.current?.expandAll()}
                            title={t("common.expand_all") as string}
                        >
                            <Maximize2 className="me-1 h-4 w-4" />
                            {t("common.expand_all") as string}
                        </Button>

                        {/* Add Root */}
                        <Button onClick={handleAddRoot}>
                            <Plus className="me-2 h-4 w-4" />
                            {t("categories.create")}
                        </Button>
                    </div>
                </div>

                {subtitle && (
                    <div className="px-4 lg:px-6 -mt-2">
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                )}

                {/* فقط لیست درختی، بدون قاب دور */}
                <div className="px-4 lg:px-6">
                    <div className={status.isFetching ? "relative" : ""}>
                        {status.isFetching && (
                            <div className="absolute inset-0 rounded-lg bg-background/40" />
                        )}
                        {content()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
