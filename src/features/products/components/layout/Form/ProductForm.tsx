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
import BrandSelect from './BrandSelect'
import CategorySelect from './CategorySelect'

type Props = Readonly<{
    defaultValues?: Partial<CreateProductRequest>
    initialImageUrl?: string | null
    onSubmit: (data: CreateProductRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
}>

export default function ProductForm({
    defaultValues,
    initialImageUrl,
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
                price: z.preprocess((v) => Number(v), z.number().min(0, t('validation.required'))),
                category_id: z.string().trim().min(1, t('validation.required')),
                brand_id: z.string().optional(),
                description: z.string().max(500).optional(),
                primary_image_id: z.string().optional(),
            }),
        [t],
    )

    const form = useForm<CreateProductRequest>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            sku: '',
            name: '',
            price: 0,
            category_id: '',
            brand_id: '',
            description: '',
            primary_image_id: '',
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
                price: defaultValues.price ?? 0,
                category_id: defaultValues.category_id ?? '',
                brand_id: defaultValues.brand_id ?? '',
                description: defaultValues.description ?? '',
                primary_image_id: defaultValues.primary_image_id ?? '',
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
                path === 'primary_image_id'
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
                        price: Number(values.price),
                        category_id: values.category_id.trim(),
                        brand_id: values.brand_id?.trim() || '',
                        description: values.description?.trim() || '',
                        primary_image_id: values.primary_image_id?.trim() || '',
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
                                <Label htmlFor="product-description">{t('products.form.description')}</Label>
                                <textarea
                                    id="product-description"
                                    className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={t('products.form.description_ph')}
                                    {...form.register('description')}
                                />
                            </div>
                        </div>
                        <ProductImageField initialImageUrl={initialImageUrl} />
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    )
}
