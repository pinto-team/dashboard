import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { categoriesQueries } from "@/features/categories";
import type {
    CategoryData,
    CreateCategoryRequest,
} from "@/features/categories/model/types";
import { mapFromServer } from "@/features/categories/model/types";
import type { Category } from "@/features/categories/model/types";
import { ROUTES } from "@/app/routes/routes";
import useDebounced from "@/shared/hooks/useDebounced";
import { useI18n } from "@/shared/hooks/useI18n";

export function useListCategoriesPage() {
    const { t } = useI18n();
    const navigate = useNavigate();

    // هنوز پارامترهای صفحه‌بندی را نگه می‌داریم تا API همان رفتار قبلی را داشته باشد
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(50); // پیش‌فرض بزرگ‌تر چون درخت pagination ندارد
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounced(query, 450);

    const listParams = useMemo(
        () => ({ page: page + 1, limit: pageSize, name: debouncedQuery }),
        [page, pageSize, debouncedQuery]
    );

    const { data, isLoading, isFetching, isError, error, refetch } =
        categoriesQueries.useList(listParams);

    // داده خام از سرور
    const serverItems: CategoryData[] = data?.data ?? [];
    const pagination = data?.meta?.pagination;

    // مپ به مدل کلاینت برای مصرف در درخت
    const items: Category[] = useMemo(
        () => serverItems.map(mapFromServer),
        [serverItems]
    );

    const total = pagination?.total ?? serverItems.length;

    // اگر query/pageSize عوض شد، صفحه را به ۰ برگردان (فقط برای API)
    useEffect(() => {
        setPage(0);
    }, [debouncedQuery, pageSize]);

    // حذف
    const deleteMutation = categoriesQueries.useDelete();
    const createMutation = categoriesQueries.useCreate();

    const handleDelete = useCallback(
        (id: string) => {
            const toDelete = serverItems.find((x) => x.id === id) || null;
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast(t("categories.deleted"), {
                        action: {
                            label: t("common.undo"),
                            onClick: () => {
                                if (!toDelete) return;
                                const payload: CreateCategoryRequest = {
                                    name: toDelete.name,
                                    // از undefined/null استفاده می‌کنیم نه رشته خالی
                                    description: toDelete.description ?? undefined,
                                    parent_id: toDelete.parent_id ?? undefined,
                                    image_id: toDelete.image_id ?? undefined,
                                };
                                createMutation.mutate(payload, {
                                    onSuccess: () => {
                                        toast.success(t("common.restored"));
                                        void refetch();
                                    },
                                    onError: () => toast.error(t("common.error")),
                                });
                            },
                        },
                    });
                    void refetch();
                },
                onError: () => {
                    toast.error(t("common.error"));
                },
            });
        },
        [createMutation, deleteMutation, refetch, serverItems, t]
    );

    // ناوبری‌های مورد نیاز صفحه
    const nav = { navigate, ROUTES };

    return {
        nav,
        i18n: { t },
        // queryState هنوز نگه داشته می‌شود (Search ورودی بالای صفحه از آن استفاده می‌کند)
        queryState: { query, setQuery, page, setPage, pageSize, setPageSize },
        // لیست برای UI: اقلام کلاینتی (Category[])
        list: { items, total },
        status: { isLoading, isFetching, isError, error },
        actions: { refetch, handleDelete },
    };
}
