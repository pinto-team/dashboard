// features/brands/components/BrandForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import * as React from 'react'
import { JSX } from 'react'

import { FormProvider, useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import { CreateBrandRequest } from '@/features/brands/model/types.ts'
import BrandGeneralFields from './BrandGeneralFields.tsx'
import BrandCountryWebsiteFields from './BrandCountryWebsiteFields.tsx'
import BrandLogoField from './BrandLogoField.tsx'

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

    const form = useForm<CreateBrandRequest>({
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

    const { handleSubmit, reset, setError } = form

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
        <FormProvider {...form}>
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
                            <BrandGeneralFields />
                            <BrandCountryWebsiteFields />
                        </div>
                        <BrandLogoField initialLogoUrl={initialLogoUrl} />
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    )
}
