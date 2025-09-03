import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import * as React from 'react'
import { JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import { CreateProductRequest } from '@/features/products/model/types'

type Props = Readonly<{
    defaultValues?: Partial<CreateProductRequest>
    onSubmit: (data: CreateProductRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
}>

export default function ProductForm({
                                        defaultValues, onSubmit, submitting = false, formId = 'product-form', apiErrors,
                                    }: Props): JSX.Element {
    const { t } = useI18n()

    // ---------- Zod schema (بر اساس createFields) ----------
    const schema = React.useMemo(() => z.object({
        sku: z.string().trim(),
        name: z.string().trim()
            .min(1, t('validation.required')).min(2, t('validation.min_length', { n: 2 })),
        full_name: z.string().trim()
            .min(1, t('validation.required')).min(2, t('validation.min_length', { n: 2 })),


        description: z.string().trim()

            .max(500, t('validation.max_length', { n: 500 })),

        brand_id: z.any(),
        category_id: z.any(),
        price: z.number({ invalid_type_error: t('validation.number') }),
        wholesale_price: z.number({ invalid_type_error: t('validation.number') }),
        purchase_price: z.number({ invalid_type_error: t('validation.number') }),
        currency: z.string().trim(),

        tax_rate: z.number({ invalid_type_error: t('validation.number') }),
        pricing_tiers: z.array(z.any()),
        unit_of_sale: z.string().trim(),

        pack_size: z.number({ invalid_type_error: t('validation.number') }),
        case_size: z.number({ invalid_type_error: t('validation.number') }),
        pallet_size: z.number({ invalid_type_error: t('validation.number') }),
        barcode: z.string().trim(),
        barcode_type: z.string().trim(),
        attributes: z.record(z.any()),
        weight: z.number({ invalid_type_error: t('validation.number') }),
        weight_unit: z.string().trim(),
        dimensions: z.record(z.any()),
        packaging: z.string().trim(),
        storage: z.string().trim(),
        shelf_life_days: z.number({ invalid_type_error: t('validation.number') }),
        halal: z.boolean(),
        allow_backorder: z.boolean(),
        is_active: z.boolean(),
        tags: z.array(z.any()),
        certifications: z.array(z.any()),
        ingredients: z.array(z.any()),
        nutrition_facts: z.record(z.any()),
        warranty_months: z.number({ invalid_type_error: t('validation.number') }),
        returnable: z.boolean(),
    }), [t])

    const {
        register, handleSubmit, formState: { errors }, setError, reset,
    } = useForm<CreateProductRequest>({
        resolver: zodResolver(schema), defaultValues: {
            sku: '',
            name: '',
            full_name: '',
            description: '',
            brand_id: undefined,
            category_id: undefined,
            price: 0,
            wholesale_price: 0,
            purchase_price: 0,
            currency: '',
            tax_rate: 0,
            pricing_tiers: [],
            unit_of_sale: '',
            pack_size: 0,
            case_size: 0,
            pallet_size: 0,
            barcode: '',
            barcode_type: '',
            attributes: {},
            weight: 0,
            weight_unit: '',
            dimensions: {},
            packaging: '',
            storage: '',
            shelf_life_days: 0,
            halal: false,
            allow_backorder: false,
            is_active: false,
            tags: [],
            certifications: [],
            ingredients: [],
            nutrition_facts: {},
            warranty_months: 0,
            returnable: false, ...defaultValues,
        } as any, // در صورت تفاوت جزئی تایپ‌ها
        mode: 'onBlur',
    })

    React.useEffect(() => {
        if (defaultValues) {
            reset({ ...defaultValues } as any)
        }
    }, [defaultValues, reset])

    React.useEffect(() => {
        if (!apiErrors || apiErrors.length === 0) return
        apiErrors.forEach((err) => {
            const path = err.field?.split('.')?.pop() ?? err.field
            if (path === 'sku') {
                setError('sku' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'name') {
                setError('name' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'full_name') {
                setError('full_name' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'description') {
                setError('description' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'brand_id') {
                setError('brand_id' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'category_id') {
                setError('category_id' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'price') {
                setError('price' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'wholesale_price') {
                setError('wholesale_price' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'purchase_price') {
                setError('purchase_price' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'currency') {
                setError('currency' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'tax_rate') {
                setError('tax_rate' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'pricing_tiers') {
                setError('pricing_tiers' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'unit_of_sale') {
                setError('unit_of_sale' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'pack_size') {
                setError('pack_size' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'case_size') {
                setError('case_size' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'pallet_size') {
                setError('pallet_size' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'barcode') {
                setError('barcode' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'barcode_type') {
                setError('barcode_type' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'attributes') {
                setError('attributes' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'weight') {
                setError('weight' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'weight_unit') {
                setError('weight_unit' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'dimensions') {
                setError('dimensions' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'packaging') {
                setError('packaging' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'storage') {
                setError('storage' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'shelf_life_days') {
                setError('shelf_life_days' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'halal') {
                setError('halal' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'allow_backorder') {
                setError('allow_backorder' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'is_active') {
                setError('is_active' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'tags') {
                setError('tags' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'certifications') {
                setError('certifications' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'ingredients') {
                setError('ingredients' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'nutrition_facts') {
                setError('nutrition_facts' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'warranty_months') {
                setError('warranty_months' as any, {
                    type: 'server', message: err.message,
                })
            }
            if (path === 'returnable') {
                setError('returnable' as any, {
                    type: 'server', message: err.message,
                })
            }
        })
    }, [apiErrors, setError])

    return (<form
            id={formId}
            noValidate
            className="grid gap-6"
            onSubmit={handleSubmit((values) => {
                const cleaned = {
                    sku: (values.sku ?? '').toString().trim(),
                    name: (values.name ?? '').toString().trim(),
                    full_name: (values.full_name ?? '').toString().trim(),
                    description: (values.description ?? '').toString().trim(),
                    brand_id: values.brand_id,
                    category_id: values.category_id,
                    price: typeof values.price === 'number' ? values.price : Number(values.price ?? 0),
                    wholesale_price: typeof values.wholesale_price === 'number' ? values.wholesale_price : Number(values.wholesale_price ?? 0),
                    purchase_price: typeof values.purchase_price === 'number' ? values.purchase_price : Number(values.purchase_price ?? 0),
                    currency: (values.currency ?? '').toString().trim(),
                    tax_rate: typeof values.tax_rate === 'number' ? values.tax_rate : Number(values.tax_rate ?? 0),
                    pricing_tiers: Array.isArray(values.pricing_tiers) ? values.pricing_tiers : [],
                    unit_of_sale: (values.unit_of_sale ?? '').toString().trim(),
                    pack_size: typeof values.pack_size === 'number' ? values.pack_size : Number(values.pack_size ?? 0),
                    case_size: typeof values.case_size === 'number' ? values.case_size : Number(values.case_size ?? 0),
                    pallet_size: typeof values.pallet_size === 'number' ? values.pallet_size : Number(values.pallet_size ?? 0),
                    barcode: (values.barcode ?? '').toString().trim(),
                    barcode_type: (values.barcode_type ?? '').toString().trim(),
                    attributes: values.attributes && typeof values.attributes === 'object' ? values.attributes : {},
                    weight: typeof values.weight === 'number' ? values.weight : Number(values.weight ?? 0),
                    weight_unit: (values.weight_unit ?? '').toString().trim(),
                    dimensions: values.dimensions && typeof values.dimensions === 'object' ? values.dimensions : {},
                    packaging: (values.packaging ?? '').toString().trim(),
                    storage: (values.storage ?? '').toString().trim(),
                    shelf_life_days: typeof values.shelf_life_days === 'number' ? values.shelf_life_days : Number(values.shelf_life_days ?? 0),
                    halal: Boolean(values.halal),
                    allow_backorder: Boolean(values.allow_backorder),
                    is_active: Boolean(values.is_active),
                    tags: Array.isArray(values.tags) ? values.tags : [],
                    certifications: Array.isArray(values.certifications) ? values.certifications : [],
                    ingredients: Array.isArray(values.ingredients) ? values.ingredients : [],
                    nutrition_facts: values.nutrition_facts && typeof values.nutrition_facts === 'object' ? values.nutrition_facts : {},
                    warranty_months: typeof values.warranty_months === 'number' ? values.warranty_months : Number(values.warranty_months ?? 0),
                    returnable: Boolean(values.returnable),
                } as CreateProductRequest
                onSubmit(cleaned)
            })}
        >
            <Card className="overflow-hidden shadow-sm">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="text-lg font-semibold">
                        {t('product.form.title')}
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="product-sku">
                                {t('product.form.sku')}
                            </Label>
                            <Input
                                id="product-sku"
                                placeholder={t('product.form.sku_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.sku)}
                                {...register('sku' as const)}
                            />
                            {errors.sku && (<p className="mt-1 text-xs text-destructive">
                                    {errors.sku.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-name">
                                {t('product.form.name')}*
                            </Label>
                            <Input
                                id="product-name"
                                placeholder={t('product.form.name_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.name)}
                                {...register('name' as const)}
                            />
                            {errors.name && (<p className="mt-1 text-xs text-destructive">
                                    {errors.name.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-full_name">
                                {t('product.form.full_name')}*
                            </Label>
                            <Input
                                id="product-full_name"
                                placeholder={t('product.form.full_name_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.full_name)}
                                {...register('full_name' as const)}
                            />
                            {errors.full_name && (<p className="mt-1 text-xs text-destructive">
                                    {errors.full_name.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-description">
                                {t('product.form.description')}
                            </Label>
                            <textarea
                                id="product-description"
                                placeholder={t('product.form.description_ph')}
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-invalid={Boolean(errors.description)}
                                {...register('description' as const)}
                            />
                            {errors.description && (<p className="mt-1 text-xs text-destructive">
                                    {errors.description.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-brand_id">
                                {t('product.form.brand_id')}
                            </Label>
                            <Input
                                id="product-brand_id"
                                aria-invalid={Boolean(errors.brand_id)}
                                {...register('brand_id' as const)}
                            />
                            {errors.brand_id && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.brand_id.message)}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-category_id">
                                {t('product.form.category_id')}
                            </Label>
                            <Input
                                id="product-category_id"
                                aria-invalid={Boolean(errors.category_id)}
                                {...register('category_id' as const)}
                            />
                            {errors.category_id && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.category_id.message)}
                                </p>)}
                        </div>

                        <div>
                            <Label htmlFor="product-price">
                                {t('product.form.price')}
                            </Label>
                            <Input
                                id="product-price"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.price)}
                                {...register('price' as const, { valueAsNumber: true })}
                            />
                            {errors.price && (<p className="mt-1 text-xs text-destructive">
                                    {errors.price.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-wholesale_price">
                                {t('product.form.wholesale_price')}
                            </Label>
                            <Input
                                id="product-wholesale_price"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.wholesale_price)}
                                {...register('wholesale_price' as const, { valueAsNumber: true })}
                            />
                            {errors.wholesale_price && (<p className="mt-1 text-xs text-destructive">
                                    {errors.wholesale_price.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-purchase_price">
                                {t('product.form.purchase_price')}
                            </Label>
                            <Input
                                id="product-purchase_price"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.purchase_price)}
                                {...register('purchase_price' as const, { valueAsNumber: true })}
                            />
                            {errors.purchase_price && (<p className="mt-1 text-xs text-destructive">
                                    {errors.purchase_price.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-currency">
                                {t('product.form.currency')}
                            </Label>
                            <Input
                                id="product-currency"
                                placeholder={t('product.form.currency_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.currency)}
                                {...register('currency' as const)}
                            />
                            {errors.currency && (<p className="mt-1 text-xs text-destructive">
                                    {errors.currency.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-tax_rate">
                                {t('product.form.tax_rate')}
                            </Label>
                            <Input
                                id="product-tax_rate"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.tax_rate)}
                                {...register('tax_rate' as const, { valueAsNumber: true })}
                            />
                            {errors.tax_rate && (<p className="mt-1 text-xs text-destructive">
                                    {errors.tax_rate.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-pricing_tiers">
                                {t('product.form.pricing_tiers')}
                            </Label>
                            <textarea
                                id="product-pricing_tiers"
                                placeholder="{ /* JSON */ }"
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                aria-invalid={Boolean(errors.pricing_tiers)}
                                {...register('pricing_tiers' as const)}
                            />
                            {errors.pricing_tiers && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.pricing_tiers.message)}
                                </p>)}
                        </div>

                        <div>
                            <Label htmlFor="product-unit_of_sale">
                                {t('product.form.unit_of_sale')}
                            </Label>
                            <Input
                                id="product-unit_of_sale"
                                placeholder={t('product.form.unit_of_sale_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.unit_of_sale)}
                                {...register('unit_of_sale' as const)}
                            />
                            {errors.unit_of_sale && (<p className="mt-1 text-xs text-destructive">
                                    {errors.unit_of_sale.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-pack_size">
                                {t('product.form.pack_size')}
                            </Label>
                            <Input
                                id="product-pack_size"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.pack_size)}
                                {...register('pack_size' as const, { valueAsNumber: true })}
                            />
                            {errors.pack_size && (<p className="mt-1 text-xs text-destructive">
                                    {errors.pack_size.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-case_size">
                                {t('product.form.case_size')}
                            </Label>
                            <Input
                                id="product-case_size"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.case_size)}
                                {...register('case_size' as const, { valueAsNumber: true })}
                            />
                            {errors.case_size && (<p className="mt-1 text-xs text-destructive">
                                    {errors.case_size.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-pallet_size">
                                {t('product.form.pallet_size')}
                            </Label>
                            <Input
                                id="product-pallet_size"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.pallet_size)}
                                {...register('pallet_size' as const, { valueAsNumber: true })}
                            />
                            {errors.pallet_size && (<p className="mt-1 text-xs text-destructive">
                                    {errors.pallet_size.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-barcode">
                                {t('product.form.barcode')}
                            </Label>
                            <Input
                                id="product-barcode"
                                placeholder={t('product.form.barcode_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.barcode)}
                                {...register('barcode' as const)}
                            />
                            {errors.barcode && (<p className="mt-1 text-xs text-destructive">
                                    {errors.barcode.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-barcode_type">
                                {t('product.form.barcode_type')}
                            </Label>
                            <Input
                                id="product-barcode_type"
                                placeholder={t('product.form.barcode_type_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.barcode_type)}
                                {...register('barcode_type' as const)}
                            />
                            {errors.barcode_type && (<p className="mt-1 text-xs text-destructive">
                                    {errors.barcode_type.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-attributes">
                                {t('product.form.attributes')}
                            </Label>
                            <textarea
                                id="product-attributes"
                                placeholder="{ /* JSON */ }"
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                aria-invalid={Boolean(errors.attributes)}
                                {...register('attributes' as const)}
                            />
                            {errors.attributes && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.attributes.message)}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-weight">
                                {t('product.form.weight')}
                            </Label>
                            <Input
                                id="product-weight"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.weight)}
                                {...register('weight' as const, { valueAsNumber: true })}
                            />
                            {errors.weight && (<p className="mt-1 text-xs text-destructive">
                                    {errors.weight.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-weight_unit">
                                {t('product.form.weight_unit')}
                            </Label>
                            <Input
                                id="product-weight_unit"
                                placeholder={t('product.form.weight_unit_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.weight_unit)}
                                {...register('weight_unit' as const)}
                            />
                            {errors.weight_unit && (<p className="mt-1 text-xs text-destructive">
                                    {errors.weight_unit.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-dimensions">
                                {t('product.form.dimensions')}
                            </Label>
                            <textarea
                                id="product-dimensions"
                                placeholder="{ /* JSON */ }"
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                aria-invalid={Boolean(errors.dimensions)}
                                {...register('dimensions' as const)}
                            />
                            {errors.dimensions && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.dimensions.message)}
                                </p>)}
                        </div>

                        <div>
                            <Label htmlFor="product-packaging">
                                {t('product.form.packaging')}
                            </Label>
                            <Input
                                id="product-packaging"
                                placeholder={t('product.form.packaging_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.packaging)}
                                {...register('packaging' as const)}
                            />
                            {errors.packaging && (<p className="mt-1 text-xs text-destructive">
                                    {errors.packaging.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-storage">
                                {t('product.form.storage')}
                            </Label>
                            <Input
                                id="product-storage"
                                placeholder={t('product.form.storage_ph')}
                                autoComplete="off"
                                aria-invalid={Boolean(errors.storage)}
                                {...register('storage' as const)}
                            />
                            {errors.storage && (<p className="mt-1 text-xs text-destructive">
                                    {errors.storage.message as string}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-shelf_life_days">
                                {t('product.form.shelf_life_days')}
                            </Label>
                            <Input
                                id="product-shelf_life_days"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.shelf_life_days)}
                                {...register('shelf_life_days' as const, { valueAsNumber: true })}
                            />
                            {errors.shelf_life_days && (<p className="mt-1 text-xs text-destructive">
                                    {errors.shelf_life_days.message as string}
                                </p>)}
                        </div>


                        <div className="flex items-center gap-2">
                            <input
                                id="product-halal"
                                type="checkbox"
                                aria-invalid={Boolean(errors.halal)}
                                {...register('halal' as const)}
                            />
                            <Label htmlFor="product-halal">
                                {t('product.form.halal')}
                            </Label>
                        </div>


                        <div className="flex items-center gap-2">
                            <input
                                id="product-allow_backorder"
                                type="checkbox"
                                aria-invalid={Boolean(errors.allow_backorder)}
                                {...register('allow_backorder' as const)}
                            />
                            <Label htmlFor="product-allow_backorder">
                                {t('product.form.allow_backorder')}
                            </Label>
                        </div>


                        <div className="flex items-center gap-2">
                            <input
                                id="product-is_active"
                                type="checkbox"
                                aria-invalid={Boolean(errors.is_active)}
                                {...register('is_active' as const)}
                            />
                            <Label htmlFor="product-is_active">
                                {t('product.form.is_active')}
                            </Label>
                        </div>


                        <div>
                            <Label htmlFor="product-tags">
                                {t('product.form.tags')}
                            </Label>
                            <textarea
                                id="product-tags"
                                placeholder="{ /* JSON */ }"
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                aria-invalid={Boolean(errors.tags)}
                                {...register('tags' as const)}
                            />
                            {errors.tags && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.tags.message)}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-certifications">
                                {t('product.form.certifications')}
                            </Label>
                            <textarea
                                id="product-certifications"
                                placeholder="{ /* JSON */ }"
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                aria-invalid={Boolean(errors.certifications)}
                                {...register('certifications' as const)}
                            />
                            {errors.certifications && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.certifications.message)}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-ingredients">
                                {t('product.form.ingredients')}
                            </Label>
                            <textarea
                                id="product-ingredients"
                                placeholder="{ /* JSON */ }"
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                aria-invalid={Boolean(errors.ingredients)}
                                {...register('ingredients' as const)}
                            />
                            {errors.ingredients && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.ingredients.message)}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-nutrition_facts">
                                {t('product.form.nutrition_facts')}
                            </Label>
                            <textarea
                                id="product-nutrition_facts"
                                placeholder="{ /* JSON */ }"
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                aria-invalid={Boolean(errors.nutrition_facts)}
                                {...register('nutrition_facts' as const)}
                            />
                            {errors.nutrition_facts && (<p className="mt-1 text-xs text-destructive">
                                    {String(errors.nutrition_facts.message)}
                                </p>)}
                        </div>


                        <div>
                            <Label htmlFor="product-warranty_months">
                                {t('product.form.warranty_months')}
                            </Label>
                            <Input
                                id="product-warranty_months"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.warranty_months)}
                                {...register('warranty_months' as const, { valueAsNumber: true })}
                            />
                            {errors.warranty_months && (<p className="mt-1 text-xs text-destructive">
                                    {errors.warranty_months.message as string}
                                </p>)}
                        </div>


                        <div className="flex items-center gap-2">
                            <input
                                id="product-returnable"
                                type="checkbox"
                                aria-invalid={Boolean(errors.returnable)}
                                {...register('returnable' as const)}
                            />
                            <Label htmlFor="product-returnable">
                                {t('product.form.returnable')}
                            </Label>
                        </div>


                    </div>
                </CardContent>
            </Card>
        </form>)
}
