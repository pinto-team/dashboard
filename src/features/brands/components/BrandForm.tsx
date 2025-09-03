import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import * as React from 'react'
import { JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import { CreateBrandRequest } from '@/features/brands/model/types'

type Props = Readonly<{
defaultValues?: Partial<CreateBrandRequest>
    onSubmit: (data: CreateBrandRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
    }>

    export default function BrandForm({
    defaultValues,
    onSubmit,
    submitting = false,
    formId = 'brand-form',
    apiErrors,
    }: Props): JSX.Element {
    const { t } = useI18n()

    // ---------- Zod schema (بر اساس createFields) ----------
    const schema = React.useMemo(
    () =>
    z.object({
            name: z.string().trim()
            .min(1, t('validation.required')).min(2, t('validation.min_length', { n: 2 }))
            ,





            description: z.string().trim()
            
            .max(500, t('validation.max_length', { n: 500 })),





            country: z.string().trim()
            
            ,





            website: z.string().trim()
            
            ,










            logo_url: z.any(),
    }),
    [t],
    )

    const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    } = useForm<CreateBrandRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
            name: '',
            description: '',
            country: '',
            website: '',
            logo_url: undefined,
    ...defaultValues,
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
        if (path === 'name') {
        setError('name' as any, {
        type: 'server',
        message: err.message,
        })
        }
        if (path === 'description') {
        setError('description' as any, {
        type: 'server',
        message: err.message,
        })
        }
        if (path === 'country') {
        setError('country' as any, {
        type: 'server',
        message: err.message,
        })
        }
        if (path === 'website') {
        setError('website' as any, {
        type: 'server',
        message: err.message,
        })
        }
        if (path === 'logo_url') {
        setError('logo_url' as any, {
        type: 'server',
        message: err.message,
        })
        }
    })
    }, [apiErrors, setError])

    return (
    <form
        id={formId}
        noValidate
        className="grid gap-6"
        onSubmit={handleSubmit((values) => {
    const cleaned = {
            name: (values.name ?? '').toString().trim(),
            description: (values.description ?? '').toString().trim(),
            country: (values.country ?? '').toString().trim(),
            website: (values.website ?? '').toString().trim(),
            logo_url: values.logo_url,
    } as CreateBrandRequest
    onSubmit(cleaned)
    })}
    >
    <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg font-semibold">
                {t('brand.form.title')}
            </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="brand-name">
                                    {t('brand.form.name')}*
                                </Label>
                                <Input
                                    id="brand-name"
                                    placeholder={t('brand.form.name_ph')}
                                    autoComplete="off"
                                    aria-invalid={Boolean(errors.name)}
                                    {...register('name' as const)}
                                />
                                {errors.name && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.name.message as string}
                                </p>
                                )}
                            </div>




                            <div>
                                <Label htmlFor="brand-description">
                                    {t('brand.form.description')}
                                </Label>
                                <textarea
                                    id="brand-description"
                                    placeholder={t('brand.form.description_ph')}
                                    className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-invalid={Boolean(errors.description)}
                                    {...register('description' as const)}
                                />
                                {errors.description && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.description.message as string}
                                </p>
                                )}
                            </div>




                            <div>
                                <Label htmlFor="brand-country">
                                    {t('brand.form.country')}
                                </Label>
                                <Input
                                    id="brand-country"
                                    placeholder={t('brand.form.country_ph')}
                                    autoComplete="off"
                                    aria-invalid={Boolean(errors.country)}
                                    {...register('country' as const)}
                                />
                                {errors.country && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.country.message as string}
                                </p>
                                )}
                            </div>




                            <div>
                                <Label htmlFor="brand-website">
                                    {t('brand.form.website')}
                                </Label>
                                <Input
                                    id="brand-website"
                                    placeholder={t('brand.form.website_ph')}
                                    autoComplete="off"
                                    aria-invalid={Boolean(errors.website)}
                                    {...register('website' as const)}
                                />
                                {errors.website && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.website.message as string}
                                </p>
                                )}
                            </div>








                        <div>
                            <Label htmlFor="brand-logo_url">
                                {t('brand.form.logo_url')}
                            </Label>
                            <Input
                                id="brand-logo_url"
                                aria-invalid={Boolean(errors.logo_url)}
                                {...register('logo_url' as const)}
                            />
                            {errors.logo_url && (
                            <p className="mt-1 text-xs text-destructive">
                                {String(errors.logo_url.message)}
                            </p>
                            )}
                        </div>
            </div>
        </CardContent>
    </Card>
    </form>
    )
    }
