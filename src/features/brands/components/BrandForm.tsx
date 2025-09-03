// features/brands/components/BrandForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import * as React from 'react'
import { JSX } from 'react'

import { useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import {CreateBrandRequest} from "@/features/brands/model/types.ts";
import BrandLogoUploader from '@/features/brands/components/BrandLogoUploader'

function normalizeUrl(value: string): string {
    const trimmed = value.trim()
    if (!trimmed) return ''
    const hasProtocol = /^(https?:)?\/\//i.test(trimmed)
    const candidate = hasProtocol ? trimmed : `https://${trimmed}`
    try {
        return new URL(candidate).toString()
    } catch {
        return trimmed
    }
}
function isLenientValidUrl(value: string): true | string {
    if (!value) return true
    const candidate = /^(https?:)?\/\//i.test(value) ? value : `https://${value}`
    try {
        new URL(candidate)
        return true
    } catch {
        return 'validation.url'
    }
}

type Props = Readonly<{
    defaultValues?: Partial<CreateBrandRequest>
    /** Optional initial logo URL for preview (useful on edit) */
    initialLogoUrl?: string | null
    onSubmit: (data: CreateBrandRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
}>

export default function BrandForm({
    defaultValues,
    initialLogoUrl,
    onSubmit,
    submitting = false,
    formId = 'brand-form',
    apiErrors,
}: Props): JSX.Element {
    const { t } = useI18n()

    const schema = React.useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, t('validation.required'))
                    .min(2, t('validation.min_length', { n: 2 }))
                    .max(120, t('validation.max_length', { n: 120 })),
                description: z
                    .union([
                        z.string().max(500, t('validation.max_length', { n: 500 })),
                        z.literal(''),
                    ])
                    .optional(),
                country: z
                    .union([
                        z.string().max(60, t('validation.max_length', { n: 60 })),
                        z.literal(''),
                    ])
                    .optional(),
                website: z
                    .union([
                        z.string().max(2048, t('validation.max_length', { n: 2048 })),
                        z.literal(''),
                    ])
                    .optional()
                    .refine((v) => !v || isLenientValidUrl(v) === true, t('validation.url')),
                logo_id: z.union([z.string(), z.literal('')]).optional(),
            }),
        [t],
    )

    const {
        register,
        handleSubmit,
        setValue,
        watch,
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
            logo_id: '',
            ...defaultValues,
        },
        mode: 'onBlur',
    })

    React.useEffect(() => {
        if (defaultValues) {
            reset({
                name: defaultValues.name ?? '',
                description: defaultValues.description ?? '',
                country: defaultValues.country ?? '',
                website: defaultValues.website ?? '',
                logo_id: defaultValues.logo_id ?? '',
            })
        }
    }, [defaultValues, reset])

    const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string>(initialLogoUrl || '')

    React.useEffect(() => {
        if (!apiErrors || apiErrors.length === 0) return
        apiErrors.forEach((err) => {
            const path = err.field?.split('.')?.pop() ?? err.field
            if (
                path === 'name' ||
                path === 'description' ||
                path === 'country' ||
                path === 'website' ||
                path === 'logo_id'
            ) {
                setError(path as keyof CreateBrandRequest, { type: 'server', message: err.message })
            }
        })
    }, [apiErrors, setError])

    return (
        <form
            id={formId}
            noValidate
            className="grid gap-6"
            onSubmit={handleSubmit((values) => {
                const cleaned: CreateBrandRequest = {
                    name: values.name.trim(),
                    description: values.description?.trim() || '',
                    country: values.country?.trim() || '',
                    website: values.website ? normalizeUrl(values.website) : '',
                    logo_id: values.logo_id?.trim() || '',
                }
                onSubmit(cleaned)
            })}
        >
            <Card className="overflow-hidden shadow-sm">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="text-lg font-semibold">
                        {t('brands.form.title')}
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="brand-name">{t('brands.form.name')}*</Label>
                            <Input
                                id="brand-name"
                                placeholder={t('brands.form.name_ph')}
                                autoComplete="organization"
                                aria-invalid={Boolean(errors.name)}
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="brand-country">{t('brands.form.country')}</Label>
                                <Input
                                    id="brand-country"
                                    placeholder={t('brands.form.country_ph')}
                                    autoComplete="country-name"
                                    aria-invalid={Boolean(errors.country)}
                                    {...register('country')}
                                />
                                {errors.country && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.country.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="brand-website">{t('brands.form.website')}</Label>
                                <Input
                                    id="brand-website"
                                    placeholder={t('brands.form.website_ph')}
                                    inputMode="url"
                                    autoComplete="url"
                                    aria-invalid={Boolean(errors.website)}
                                    {...register('website')}
                                />
                                {errors.website && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.website.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="brand-description">
                                {t('brands.form.description')}
                            </Label>
                            <textarea
                                id="brand-description"
                                placeholder={t('brands.form.description_ph')}
                                className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-invalid={Boolean(errors.description)}
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <BrandLogoUploader
                            value={logoPreviewUrl || ''}
                            onChange={(file) => {
                                const id = file?.id || ''
                                const url = file?.url || ''
                                setLogoPreviewUrl(url)
                                setValue('logo_id', id, { shouldDirty: true })
                            }}
                            label={t('brands.form.logo')}
                            aspect="square"
                            className="h-56 w-full self-start"
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                            {t('brands.form.logo_help')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
