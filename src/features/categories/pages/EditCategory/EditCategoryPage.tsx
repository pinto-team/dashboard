import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';



import * as React from 'react';



import { useNavigate, useParams } from 'react-router-dom';



import { ROUTES } from '@/app/routes/routes';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import CategoryForm from '@/features/categories/components/CategoryForm';
import type {
    CategoryData,
    CategoryFormValues,
    CreateCategoryRequest,
} from '@/features/categories/model/types';
import { categoriesApiService } from '@/features/categories/services/categories.api';
import { toAbsoluteUrl } from '@/shared/api/files.ts';
import { useI18n } from '@/shared/hooks/useI18n';
import { isRTLLocale } from '@/shared/i18n/utils';
import { ensureLocalizedDefaults } from '@/shared/utils/localized';





const SUPPORTED_LOCALES = ['en-US', 'fa-IR'] as const

function mapCategoryToFormValues(category: CategoryData): CategoryFormValues {
    const nameDefaults = ensureLocalizedDefaults(category.name, SUPPORTED_LOCALES)
    const descriptionDefaults = ensureLocalizedDefaults(category.description ?? undefined, SUPPORTED_LOCALES)

    const sanitizedName = { ...nameDefaults }
    Object.entries(category.name ?? {}).forEach(([key, value]) => {
        if (typeof value === 'string') {
            sanitizedName[key] = value
        }
    })

    const sanitizedDescription = { ...descriptionDefaults }
    if (category.description) {
        Object.entries(category.description).forEach(([key, value]) => {
            if (typeof value === 'string') {
                sanitizedDescription[key] = value
            }
        })
    }

    return {
        name: sanitizedName,
        description: sanitizedDescription,
        slug: category.slug ?? '',
        parent_id: category.parent_id ?? null,
        sort_index: category.sort_index ?? 0,
        image_id: category.image_id ?? undefined,
        is_active: category.is_active ?? true,
    }
}

function resolveCategoryImage(category: CategoryData): string | null {
    const legacyImage = (category as { image_url?: string | null }).image_url
    const raw = legacyImage ?? category.image ?? null
    return raw ? toAbsoluteUrl(raw) : null
}

const FORM_ID = 'category-form'

export default function EditCategoryPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)

    const [initialData, setInitialData] = React.useState<CategoryFormValues | null>(null)
    const [initialImageUrl, setInitialImageUrl] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)
    const [apiErrors, setApiErrors] = React.useState<
        ReadonlyArray<{ field: string; message: string }>
    >([])

    React.useEffect(() => {
        if (!id) return
        let mounted = true
        ;(async () => {
            try {
                const res = await categoriesApiService.get(id)
                if (!mounted) return
                const d = res.data.data
                setInitialData(mapCategoryToFormValues(d))
                setInitialImageUrl(resolveCategoryImage(d))

            } catch {
                toast.error(t('common.error'))
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => {
            mounted = false
        }
    }, [id, t])

    const handleSubmit = (values: CreateCategoryRequest) => {
        if (!id) return
        setApiErrors([])
        setSaving(true)
        categoriesApiService
            .update(id, values)
            .then(() => {
                toast.success(t('categories.saved_success'))
                navigate(ROUTES.CATEGORY.LIST)
            })
            .catch((err: any) => {
                const resp = err?.response?.data as {
                    code?: number
                    errors?: Array<{ field: string; message: string }>
                }
                if (resp?.code === 422 && Array.isArray(resp.errors)) {
                    setApiErrors(resp.errors)
                } else {
                    toast.error(t('common.error'))
                }
            })
            .finally(() => setSaving(false))
    }

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="shadow-none"
                            onClick={() => navigate(-1)}
                            aria-label={t('common.back')}
                            title={t('common.back')}
                        >
                            {rtl ? (
                                <ArrowRight className="h-4 w-4" />
                            ) : (
                                <ArrowLeft className="h-4 w-4" />
                            )}
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('categories.edit')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="submit" form={FORM_ID} disabled={saving || loading}>
                            {saving ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                        {t('common.loading')}
                    </div>
                ) : (
                    <CategoryForm
                        formId={FORM_ID}
                        defaultValues={initialData ?? undefined}
                        initialImageUrl={initialImageUrl}
                        onSubmit={handleSubmit}
                        submitting={saving}
                        apiErrors={apiErrors}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}
