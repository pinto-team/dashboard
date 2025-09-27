import * as React from "react"
import { useMemo, useCallback, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { brandsQueries } from "@/features/brands"
import type { BrandData, BrandFormValues, CreateBrandRequest } from "@/features/brands/model/types"
import type { SocialLinkKey } from "@/shared/constants/socialLinks"
import { SOCIAL_LINK_KEYS } from "@/shared/constants/socialLinks"
import { ROUTES } from "@/app/routes/routes"
import { useI18n } from "@/shared/hooks/useI18n"
import { defaultLogger } from "@/shared/lib/logger"
import { toAbsoluteUrl } from "@/shared/api/files"
import { ensureLocalizedDefaults, cleanLocalizedField, cleanSocialLinks, getLocalizedValue } from "@/shared/utils/localized"

const SUPPORTED_LOCALES = ['en-US', 'fa-IR'] as const

function brandToFormDefaults(b?: BrandData): Partial<BrandFormValues> {
    if (!b) return {}
    const name = {
        ...ensureLocalizedDefaults(b.name ?? undefined, SUPPORTED_LOCALES),
        ...(cleanLocalizedField(b.name ?? undefined) ?? {}),
    }
    const description = {
        ...ensureLocalizedDefaults(b.description ?? undefined, SUPPORTED_LOCALES),
        ...(cleanLocalizedField(b.description ?? undefined) ?? {}),
    }
    const sanitizedSocial = cleanSocialLinks(b.social_links ?? undefined) ?? {}
    const socialEntries = Object.entries(sanitizedSocial)
        .sort((a, b) => {
            const aIndex = SOCIAL_LINK_KEYS.indexOf(a[0] as SocialLinkKey)
            const bIndex = SOCIAL_LINK_KEYS.indexOf(b[0] as SocialLinkKey)
            if (aIndex === -1 && bIndex === -1) return a[0].localeCompare(b[0])
            if (aIndex === -1) return 1
            if (bIndex === -1) return -1
            return aIndex - bIndex
        })
        .map(([key, value]) => ({
            key: key as SocialLinkKey,
            url: value,
        }))

    return {
        name,
        description,
        slug: b.slug ?? '',
        website_url: b.website_url ?? '',
        logo_id: b.logo_id ?? '',
        is_active: b.is_active,
        social_links: socialEntries,
    }
}

export function useEditBrandContainer() {
    const { id: rawId } = useParams()
    const id = (rawId || "").trim()
    const navigate = useNavigate()

    const { t, locale } = useI18n()
    const rtl = (locale?.toLowerCase?.() ?? "").startsWith("fa")

    const detail = brandsQueries.useDetail(id)
    const update = brandsQueries.useUpdate()
    const del = brandsQueries.useDelete()

    const [apiErrors, setApiErrors] = React.useState<
        ReadonlyArray<{ field: string; message: string }>
    >([])
    const [deleteOpen, setDeleteOpen] = React.useState(false)

    useEffect(() => {
        if (detail.isLoading) {
            defaultLogger.info("Loading brand...", { id })
            return
        }
        if (detail.error) {
            defaultLogger.error("Failed to load brand", {
                id,
                error: (detail.error as any)?.message,
            })
            return
        }
        if (detail.data?.data) {
            defaultLogger.info("Brand loaded", {
                id: detail.data.data.id,
                name: detail.data.data.name,
            })
        }
    }, [detail.isLoading, detail.error, detail.data, id])

    const formDefaults = useMemo(
        () => brandToFormDefaults(detail.data?.data),
        [detail.data]
    )
    const initialLogoUrl = useMemo(
        () => toAbsoluteUrl(detail.data?.data?.logo ?? ""),
        [detail.data]
    )

    const goBack = useCallback((): void => {
        navigate(-1)
    }, [navigate])

    // --- Delete flow with shadcn/ui dialog ---
    const onRequestDelete = useCallback(() => {
        setDeleteOpen(true)
    }, [])

    const onConfirmDelete = useCallback(() => {
        if (!id) return
        del.mutate(id, {
            onSuccess: () => {
                toast.success(t("brands.deleted"))
                navigate(ROUTES.BRAND.LIST)
            },
            onError: () => toast.error(t("common.error")),
            onSettled: () => setDeleteOpen(false),
        })
    }, [del, id, navigate, t])

    const submit = useCallback(
        (values: CreateBrandRequest) => {
            setApiErrors([])
            update.mutate(
                { id, payload: values },
                {
                    onSuccess: () => {
                        toast.success(t("common.success"))
                        navigate(ROUTES.BRAND.LIST)
                    },
                    onError: (err) => {
                        const resp = (err as { response?: { data?: unknown } }).response
                            ?.data as
                            | {
                            code?: number
                            errors?: Array<{ field: string; message: string }>
                        }
                            | undefined
                        if (resp?.code === 422 && Array.isArray(resp.errors)) {
                            setApiErrors(resp.errors)
                        } else {
                            toast.error(t("common.error"))
                        }
                    },
                }
            )
        },
        [id, navigate, t, update]
    )

    return {
        status: {
            isLoading: detail.isLoading || !detail.data,
            isError: !!detail.error,
            error: detail.error,
            isSaving: update.isPending,
            isBusy: update.isPending || del.isPending,
        },
        ui: {
            title: detail.data?.data?.name
                ? `${t("actions.edit")}: ${getLocalizedValue(detail.data.data.name, locale)}`
                : (t("actions.edit") as string),
            rtl,
            labels: {
                back: t("common.back") as string,
                save: update.isPending
                    ? (t("common.saving") as string)
                    : (t("common.save") as string),
                delete: t("brands.actions.delete") as string,

                // labels for delete dialog
                deleteTitle: t("brands.actions.delete") as string,
                deleteDescription:
                    (t("brands.actions.delete_confirm") as string) ??
                    "Are you sure you want to delete this brand? This action cannot be undone.",
                cancel: t("common.cancel") as string,
                confirm: t("common.confirm") as string,
            },
        },
        data: {
            formDefaults,
            initialLogoUrl,
            apiErrors,
        },
        actions: {
            refetch: () => detail.refetch(),
            goBack,
            onRequestDelete,
            onConfirmDelete,
            deleteOpen,
            setDeleteOpen,
            submit,
        },
    }
}
