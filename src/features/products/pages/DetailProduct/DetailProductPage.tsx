import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import ErrorFallback from '@/components/layout/ErrorFallback'
import { useI18n } from '@/shared/hooks/useI18n'
import { toAbsoluteUrl } from '@/shared/api/files'
import { ROUTES } from '@/app/routes/routes'
import { productsQueries } from '@/features/products'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { isRTLLocale } from '@/shared/i18n/utils'

export default function DetailProductPage() {
    const { id = '' } = useParams()
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)

    const { data, isLoading, isError, error, refetch } = productsQueries.useDetail(id)
    const product = data?.data
    const attributes = React.useMemo(
        () =>
            Array.isArray(product?.attributes)
                ? product?.attributes
                : product?.attributes
                  ? Object.entries(product.attributes).map(([key, value]) => ({ key, value }))
                  : [],
        [product],
    )
    const images = React.useMemo(() => product?.images ?? [], [product])

    const goEdit = React.useCallback(() => {
        if (!product?.id) return
        navigate(ROUTES.PRODUCT.EDIT(product.id))
    }, [product?.id, navigate])

    const goBack = React.useCallback(() => {
        navigate(ROUTES.PRODUCT.LIST)
    }, [navigate])

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-6">{t('common.loading')}</div>
            </DashboardLayout>
        )
    }

    if (isError) {
        return <ErrorFallback error={error} onRetry={() => refetch()} />
    }

    if (!product) {
        return (
            <DashboardLayout>
                <div className="px-4 lg:px-6 py-10 text-sm text-muted-foreground">
                    {t('common.no_results')}
                </div>
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
                            onClick={goBack}
                            aria-label={t('common.back')}
                            title={t('common.back')}
                        >
                            {rtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">{t('products.details.title')}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button onClick={goEdit}>{t('products.actions.edit')}</Button>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="grid gap-5">
                                <Field label={t('products.table.name')} value={product.name || '-'} />
                                <Separator />
                                <Field label={t('products.table.sku')} value={product.sku || '-'} />
                                <Separator />
                                <Field label={t('products.form.full_name')} value={product.full_name || '-'} />
                                <Separator />
                                <Field label={t('products.table.price')} value={product.price ?? '-'} />
                                <Separator />
                                <Field label={t('products.form.barcode')} value={product.barcode || '-'} />
                                <Separator />
                                <Field label={t('products.form.barcode_type')} value={product.barcode_type || '-'} />
                                <Separator />
                                <Field label={t('products.form.weight')} value={product.weight ?? '-'} />
                                <Separator />
                                <Field label={t('products.form.weight_unit')} value={product.weight_unit || '-'} />
                                <Separator />
                                <Field label={t('products.form.packaging')} value={product.packaging || '-'} />
                                <Separator />
                                <Field label={t('products.form.storage')} value={product.storage || '-'} />
                                <Separator />
                                <Field
                                    label={t('products.form.shelf_life_days')}
                                    value={product.shelf_life_days ?? '-'}
                                />
                                <Separator />
                                <Field
                                    label={t('products.form.is_active')}
                                    value={product.is_active ? t('common.active') : t('common.inactive')}
                                />
                                <Separator />
                                <div className="grid gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t('products.form.description')}
                  </span>
                                    <p className="whitespace-pre-wrap text-sm leading-6">
                                        {product.description || '—'}
                                    </p>
                                </div>
                                {attributes.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="grid gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {t('products.form.attributes')}
                                            </span>
                                            <ul className="text-sm leading-6">
                                                {attributes.map((a) => (
                                                    <li key={a.key} className="break-words">
                                                        {a.key}: {a.value}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col items-start justify-center gap-4">
                                {images.length > 0 ? (
                                    <>
                                        <img
                                            src={toAbsoluteUrl(
                                                (
                                                    images.find((i) => i.id === product.primary_image_id) ||
                                                    images[0]
                                                ).url || '',
                                            )}
                                            alt={t('products.image_alt') as string}
                                            className="h-72 w-full max-w-[360px] rounded-lg object-contain border bg-background"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        {images.length > 1 && (
                                            <div className="flex flex-wrap gap-2">
                                                {images
                                                    .filter(
                                                        (img) =>
                                                            img.id !==
                                                            (product.primary_image_id ?? images[0].id),
                                                    )
                                                    .map((img) => (
                                                        <img
                                                            key={img.id}
                                                            src={toAbsoluteUrl(img.url || '')}
                                                            alt={t('products.image_alt') as string}
                                                            className="h-20 w-20 rounded-md object-cover border bg-background"
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="h-72 w-full max-w-[360px] rounded-lg border bg-muted/30" />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

function Field({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
    return (
        <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-medium break-words">{value}</span>
        </div>
    )
}
