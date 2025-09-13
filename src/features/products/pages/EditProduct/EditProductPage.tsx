import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import * as React from 'react'
import { JSX } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/app/routes/routes'
import { Button } from '@/components/ui/button'
import ProductForm from '@/features/products/components/layout/Form/ProductForm'
import type { CreateProductRequest, ProductData } from '@/features/products/model/types'
import { useI18n } from '@/shared/hooks/useI18n'
import { isRTLLocale } from '@/shared/i18n/utils'
import { productsQueries } from '@/features/products'
import ErrorFallback from '@/components/layout/ErrorFallback'

function productToFormDefaults(p?: ProductData): Partial<CreateProductRequest> {
    if (!p) return {}
    return {
        sku: p.sku ?? '',
        name: p.name ?? '',
        full_name: p.full_name ?? '',
        price: p.price ?? 0,
        category_id: p.category_id ?? '',
        brand_id: p.brand_id ?? '',
        description: p.description ?? '',
        barcode: p.barcode ?? '',
        barcode_type: p.barcode_type ?? '',
        weight: p.weight,
        weight_unit: p.weight_unit ?? '',
        packaging: p.packaging ?? '',
        storage: p.storage ?? '',
        shelf_life_days: p.shelf_life_days,
        is_active: p.is_active ?? true,
        primary_image_id: p.primary_image_id ?? '',
        image_ids: p.image_ids ?? [],
        attributes: Array.isArray(p.attributes)
            ? p.attributes.map((a) => ({ key: a.key, value: a.value }))
            : p.attributes
              ? Object.entries(p.attributes).map(([key, value]) => ({ key, value }))
              : [],
    }
}

export default function EditProductPage(): JSX.Element {
    const { id = '' } = useParams()
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)

    const detailQuery = productsQueries.useDetail(id)
    const updateMutation = productsQueries.useUpdate()
    const [apiErrors, setApiErrors] = React.useState<
        ReadonlyArray<{ field: string; message: string }>
    >([])

    const product = detailQuery.data?.data
    const formDefaults = React.useMemo(() => productToFormDefaults(product), [product])
    const primaryImageUrl = React.useMemo(() => {
        const img =
            product?.images?.find((i) => i.id === product.primary_image_id) ||
            product?.images?.[0]
        return img?.url || null
    }, [product])
    const additionalImages = React.useMemo(
        () =>
            (product?.images || [])
                .filter((img) => img.id !== (product?.primary_image_id ?? product?.images?.[0]?.id))
                .map((img) => ({ id: img.id, url: img.url || '' })),
        [product],
    )

    function handleSubmit(values: CreateProductRequest) {
        setApiErrors([])
        updateMutation.mutate(
            { id, payload: values },
            {
                onSuccess: () => {
                    toast.success(t('products.saved_success'))
                    navigate(ROUTES.PRODUCT.LIST)
                },
                onError: (err) => {
                    const resp = (err as { response?: { data?: unknown } }).response?.data as
                        | { code?: number; errors?: Array<{ field: string; message: string }> }
                        | undefined
                    if (resp?.code === 422 && Array.isArray(resp.errors)) {
                        setApiErrors(resp.errors)
                    } else {
                        toast.error(t('common.error'))
                    }
                },
            },
        )
    }

    if (detailQuery.isLoading) {
        return (
            <DashboardLayout>
                <div className="p-6">{t('common.loading')}</div>
            </DashboardLayout>
        )
    }

    if (detailQuery.isError) {
        return <ErrorFallback error={detailQuery.error} onRetry={() => detailQuery.refetch()} />
    }

    if (!product) {
        return (
            <DashboardLayout>
                <div className="p-6">{t('common.no_results')}</div>
            </DashboardLayout>
        )
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
                            {t('products.actions.edit')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="submit" form="product-form" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                </div>

                <ProductForm
                    defaultValues={formDefaults}
                    initialImageUrl={primaryImageUrl}
                    initialImages={additionalImages}
                    onSubmit={handleSubmit}
                    submitting={updateMutation.isPending}
                    apiErrors={apiErrors}
                />
            </div>
        </DashboardLayout>
    )
}
