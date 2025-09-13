import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as React from 'react'
import { JSX } from 'react'
import { FormProvider, useForm, Controller } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/shared/hooks/useI18n'
import type { CreateProductRequest } from '@/features/products/model/types'
import ProductImageField from './ProductImageField'
import ProductImagesField from './ProductImagesField'
import ProductAttributesField from './ProductAttributesField'
import BrandSelect from './BrandSelect'
import CategorySelect from './CategorySelect'

type Props = Readonly<{
    defaultValues?: Partial<CreateProductRequest>
    initialImageUrl?: string | null
    initialImages?: ReadonlyArray<{ id: string; url: string }>
    onSubmit: (data: CreateProductRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
}>

export default function ProductForm({
    defaultValues,
    initialImageUrl,
    initialImages,
    onSubmit,
    submitting = false,
    formId = 'product-form',
    apiErrors,
}: Props): JSX.Element {
    const { t } = useI18n()

    const schema = React.useMemo(
        () =>
            z.object({
                sku: z.string().max(120).optional(),
                name: z
                    .string()
                    .trim()
                    .min(1, t('validation.required'))
                    .max(120, t('validation.max_length', { n: 120 })),
                full_name: z.string().max(120).optional(),
                price: z.preprocess((v) => Number(v), z.number().min(0, t('validation.required'))),
                category_id: z.string().trim().min(1, t('validation.required')),
                brand_id: z.string().optional(),
                description: z.string().max(500).optional(),
                barcode: z.string().max(120).optional(),
                barcode_type: z.string().max(120).optional(),
                weight: z.preprocess((v) => (v === '' || v === undefined ? undefined : Number(v)), z.number().optional()),
                weight_unit: z.string().max(120).optional(),
                packaging: z.string().max(120).optional(),
                storage: z.string().max(120).optional(),
                shelf_life_days: z.preprocess((v) => (v === '' || v === undefined ? undefined : Number(v)), z.number().optional()),
                is_active: z.boolean().optional(),
                primary_image_id: z.string().optional(),
                image_ids: z.array(z.string()).optional(),
                attributes: z
                    .array(z.object({ key: z.string().min(1), value: z.string().min(1) }))
                    .optional(),
            }),
        [t],
    )

    const form = useForm<CreateProductRequest>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            sku: '',
            name: '',
            full_name: '',
            price: 0,
            category_id: '',
            brand_id: '',
            description: '',
            barcode: '',
            barcode_type: '',
            weight: undefined,
            weight_unit: '',
            packaging: '',
            storage: '',
            shelf_life_days: undefined,
            is_active: true,
            primary_image_id: '',
            image_ids: [],
            attributes: [],
            ...defaultValues,
        },
        mode: 'onBlur',
    })

    const { handleSubmit, reset, setError } = form

    React.useEffect(() => {
        if (defaultValues) {
            reset({
                sku: defaultValues.sku ?? '',
                name: defaultValues.name ?? '',
                full_name: defaultValues.full_name ?? '',
                price: defaultValues.price ?? 0,
                category_id: defaultValues.category_id ?? '',
                brand_id: defaultValues.brand_id ?? '',
                description: defaultValues.description ?? '',
                barcode: defaultValues.barcode ?? '',
                barcode_type: defaultValues.barcode_type ?? '',
                weight: defaultValues.weight,
                weight_unit: defaultValues.weight_unit ?? '',
                packaging: defaultValues.packaging ?? '',
                storage: defaultValues.storage ?? '',
                shelf_life_days: defaultValues.shelf_life_days,
                is_active: defaultValues.is_active ?? true,
                primary_image_id: defaultValues.primary_image_id ?? '',
                image_ids: defaultValues.image_ids ?? [],
                attributes: defaultValues.attributes ?? [],
            })
        }
    }, [defaultValues, reset])

    React.useEffect(() => {
        if (!apiErrors || apiErrors.length === 0) return
        apiErrors.forEach((err) => {
            const path = err.field?.split('.')?.pop() ?? err.field
            if (
                path === 'sku' ||
                path === 'name' ||
                path === 'price' ||
                path === 'category_id' ||
                path === 'brand_id' ||
                path === 'description' ||
                path === 'full_name' ||
                path === 'barcode' ||
                path === 'barcode_type' ||
                path === 'weight' ||
                path === 'weight_unit' ||
                path === 'packaging' ||
                path === 'storage' ||
                path === 'shelf_life_days' ||
                path === 'is_active' ||
                path === 'primary_image_id' ||
                path === 'image_ids' ||
                path === 'attributes'
            ) {
                setError(path as keyof CreateProductRequest, { type: 'server', message: err.message })
            }
        })
    }, [apiErrors, setError])

    return (
        <FormProvider {...form}>
            <form
                id={formId}
                noValidate
                className="grid gap-6"
                onSubmit={handleSubmit((values) => {
                    const cleaned: CreateProductRequest = {
                        sku: values.sku?.trim() || '',
                        name: values.name.trim(),
                        full_name: values.full_name?.trim() || '',
                        price: Number(values.price),
                        category_id: values.category_id.trim(),
                        brand_id: values.brand_id?.trim() || '',
                        description: values.description?.trim() || '',
                        barcode: values.barcode?.trim() || '',
                        barcode_type: values.barcode_type?.trim() || '',
                        weight: values.weight,
                        weight_unit: values.weight_unit?.trim() || '',
                        packaging: values.packaging?.trim() || '',
                        storage: values.storage?.trim() || '',
                        shelf_life_days: values.shelf_life_days,
                        is_active: values.is_active ?? true,
                        primary_image_id: values.primary_image_id?.trim() || '',
                        image_ids: values.image_ids?.filter((id) => id) || [],
                        attributes:
                            values.attributes
                                ?.filter((a) => a.key && a.value)
                                .map((a) => ({
                                    key: a.key.trim(),
                                    value: a.value.trim(),
                                })) || [],
                    }
                    onSubmit(cleaned)
                })}
            >
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-semibold">
                            {t('products.form.title')}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="product-sku">{t('products.form.sku')}</Label>
                                <Input id="product-sku" placeholder={t('products.form.sku_ph')} {...form.register('sku')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-name">{t('products.form.name')}*</Label>
                                <Input id="product-name" placeholder={t('products.form.name_ph')} {...form.register('name')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-full-name">{t('products.form.full_name')}</Label>
                                <Input
                                    id="product-full-name"
                                    placeholder={t('products.form.full_name_ph')}
                                    {...form.register('full_name')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-price">{t('products.form.price')}*</Label>
                                <Input
                                    id="product-price"
                                    type="number"
                                    step="0.01"
                                    placeholder={t('products.form.price_ph')}
                                    {...form.register('price', { valueAsNumber: true })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-category">{t('products.form.category_id')}*</Label>
                                <Controller
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <CategorySelect value={field.value} onChange={field.onChange} />
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-brand">{t('products.form.brand_id')}</Label>
                                <Controller
                                    control={form.control}
                                    name="brand_id"
                                    render={({ field }) => (
                                        <BrandSelect value={field.value} onChange={field.onChange} />
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-barcode">{t('products.form.barcode')}</Label>
                                <Input id="product-barcode" placeholder={t('products.form.barcode_ph')} {...form.register('barcode')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-barcode-type">{t('products.form.barcode_type')}</Label>
                                <Input
                                    id="product-barcode-type"
                                    placeholder={t('products.form.barcode_type_ph')}
                                    {...form.register('barcode_type')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-weight">{t('products.form.weight')}</Label>
                                <Input
                                    id="product-weight"
                                    type="number"
                                    step="0.01"
                                    placeholder={t('products.form.weight_ph')}
                                    {...form.register('weight', { valueAsNumber: true })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-weight-unit">{t('products.form.weight_unit')}</Label>
                                <Input
                                    id="product-weight-unit"
                                    placeholder={t('products.form.weight_unit_ph')}
                                    {...form.register('weight_unit')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-packaging">{t('products.form.packaging')}</Label>
                                <Input
                                    id="product-packaging"
                                    placeholder={t('products.form.packaging_ph')}
                                    {...form.register('packaging')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-storage">{t('products.form.storage')}</Label>
                                <Input id="product-storage" placeholder={t('products.form.storage_ph')} {...form.register('storage')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-shelf-life">{t('products.form.shelf_life_days')}</Label>
                                <Input
                                    id="product-shelf-life"
                                    type="number"
                                    placeholder={t('products.form.shelf_life_days_ph')}
                                    {...form.register('shelf_life_days', { valueAsNumber: true })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Controller
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <input
                                            id="product-active"
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                                <Label htmlFor="product-active" className="text-sm font-normal">
                                    {t('products.form.is_active')}
                                </Label>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="product-description">{t('products.form.description')}</Label>
                                <textarea
                                    id="product-description"
                                    className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={t('products.form.description_ph')}
                                    {...form.register('description')}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <ProductImageField initialImageUrl={initialImageUrl} />
                            <ProductImagesField initialImages={initialImages} />
                            <ProductAttributesField />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    )
}
