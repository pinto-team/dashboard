// features/brands/pages/BrandsPage/Container.tsx

import * as React from "react";
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { brandsQueries } from "@/features/brands";
import type { BrandData, CreateBrandRequest } from "@/features/brands/model/types";
import { ROUTES } from "@/app/routes/routes";
import useDebounced from "@/shared/hooks/useDebounced";
import { useI18n } from "@/shared/hooks/useI18n";

export function useBrandsPageContainer() {
    const { t } = useI18n();
    const navigate = useNavigate();

    // state
    const [page, setPage] = useState(0);
    const [pageSize] = useState(12);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounced(query, 450);

    const listParams = useMemo(
        () => ({ page: page + 1, limit: pageSize, q: debouncedQuery }),
        [page, pageSize, debouncedQuery]
    );

    // query
    const { data, isLoading, isFetching, isError, refetch } =
        brandsQueries.useList(listParams /* , { keepPreviousData: true, staleTime: 30000 } */);

    const items: BrandData[] = data?.data ?? [];
    const pagination = data?.meta?.pagination;
    const total = pagination?.total ?? items.length;
    const totalPagesFromApi = pagination?.total_pages;

    const totalPages = useMemo(
        () => Math.max(1, totalPagesFromApi ?? Math.ceil(total / pageSize)),
        [totalPagesFromApi, total, pageSize]
    );

    const hasPrev = pagination?.has_previous ?? page > 0;
    const hasNext = pagination?.has_next ?? page + 1 < totalPages;

    // mutations
    const deleteMutation = brandsQueries.useDelete();
    const createMutation = brandsQueries.useCreate();

    const handleDelete = useCallback(
        (id: string) => {
            const toDelete = items.find((x) => x.id === id) || null;

            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast(t("brands.deleted") as string, {
                        action: {
                            label: t("common.undo") as string,
                            onClick: () => {
                                if (!toDelete) return;

                                const payload: CreateBrandRequest = {
                                    name: toDelete.name ?? "",
                                    description: (toDelete as any).description ?? "",
                                    country: (toDelete as any).country ?? "",
                                    website: (toDelete as any).website ?? "",
                                    logo_id: (toDelete as any).logo_id ?? undefined,
                                };

                                createMutation.mutate(payload, {
                                    onSuccess: () => {
                                        toast.success(t("common.restored") as string);
                                        void refetch();
                                    },
                                    onError: () => {
                                        toast.error(t("common.error") as string);
                                    },
                                });
                            },
                        },
                    });

                    void refetch(); // بدون چشمک چون فقط isLoading اسکلتون می‌دهد
                },
                onError: () => {
                    toast.error(t("common.error") as string);
                },
            });
        },
        [createMutation, deleteMutation, items, refetch, t]
    );

    // pagination
    const goFirst = useCallback(() => setPage(0), []);
    const goPrev  = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
    const goNext  = useCallback(() => setPage((p) => p + 1), []);
    const goLast  = useCallback(() => setPage(Math.max(0, (totalPages ?? 1) - 1)), [totalPages]);

    return {
        nav: { navigate, ROUTES },
        i18n: { t },
        queryState: { query, setQuery, page, setPage, pageSize },
        list: { items, total, totalPages, hasPrev, hasNext },
        status: { isLoading, isFetching, isError },
        actions: { refetch, handleDelete, goFirst, goPrev, goNext, goLast },
    };
}
