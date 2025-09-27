// features/brands/components/BrandForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import * as React from 'react'
import { JSX } from 'react'

import { FormProvider, useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import type { BrandFormValues, CreateBrandRequest } from '@/features/brands/model/types.ts'
import type { SocialLinkKey } from '@/shared/constants/socialLinks.ts'
import BrandGeneralFields from './BrandGeneralFields.tsx'
import BrandMetadataFields from './BrandMetadataFields.tsx'
import BrandLogoField from './BrandLogoField.tsx'
import BrandSocialLinksFields from './BrandSocialLinksFields.tsx'
import {
    cleanLocalizedField,
    cleanSocialLinks,
    ensureLocalizedDefaults,
} from '@/shared/utils/localized.ts'

const SUPPORTED_LOCALES = ['en', 'fa'] as const
const FORM_SOCIAL_KEYS = ['instagram', 'telegram', 'linkedin', 'x'] as const satisfies ReadonlyArray<SocialLinkKey>

type TranslateFn = ReturnType<typeof useI18n>['t']

type Props = Readonly<{
    defaultValues?: Partial<BrandFormValues>
    /** Optional initial logo URL for preview (useful on edit) */
    initialLogoUrl?: string | null
    onSubmit: (data: CreateBrandRequest) => void
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
}>

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

function isLenientValidUrl(value: string): boolean {
    if (!value) return true
    const candidate = /^(https?:)?\/\//i.test(value) ? value : `https://${value}`
    try {
        new URL(candidate)
        return true
    } catch {
        return false
    }
}

function createSchema(t: TranslateFn): z.ZodType<BrandFormValues> {
    const nameRule = z
        .string()
        .trim()
        .min(1, t('validation.required'))
        .min(2, t('validation.min_length', { n: 2 }))
        .max(120, t('validation.max_length', { n: 120 }))

    const descriptionRule = z
        .string()
        .trim()
        .max(500, t('validation.max_length', { n: 500 }))

    const urlRule = z
        .string()
        .trim()
        .max(2048, t('validation.max_length', { n: 2048 }))
        .refine((value) => !value || isLenientValidUrl(value), {
            message: t('validation.url'),
        })

    return z.object({
        name: z
            .object({ en: nameRule, fa: nameRule })
            .catchall(nameRule.optional()),
        description: z
            .object({ en: descriptionRule.optional(), fa: descriptionRule.optional() })
            .catchall(descriptionRule.optional())
            .default({ en: '', fa: '' }),
        slug: z
            .string()
            .trim()
            .min(1, t('validation.required'))
            .min(2, t('validation.min_length', { n: 2 }))
            .max(160, t('validation.max_length', { n: 160 })),
        website_url: urlRule.optional().default(''),
        logo_id: z.union([z.string(), z.literal('')]).optional(),
        is_active: z.boolean(),
        social_links: z
            .object({
                instagram: urlRule.optional(),
                telegram: urlRule.optional(),
                linkedin: urlRule.optional(),
                x: urlRule.optional(),
            })
            .catchall(urlRule.optional())
            .default(
                FORM_SOCIAL_KEYS.reduce<Record<string, string>>((acc, key) => {
                    acc[key] = ''
                    return acc
                }, {}),
            ),
    }) as z.ZodType<BrandFormValues>
}

function buildDefaultValues(defaultValues?: Partial<BrandFormValues>): BrandFormValues {
    const nameDefaults = ensureLocalizedDefaults(defaultValues?.name, SUPPORTED_LOCALES)
    const descriptionDefaults = ensureLocalizedDefaults(defaultValues?.description, SUPPORTED_LOCALES)

    const sanitizedSocial = cleanSocialLinks(defaultValues?.social_links) ?? {}
    const social: Record<string, string> = {}

    FORM_SOCIAL_KEYS.forEach((key) => {
        const raw = sanitizedSocial[key]
        social[key] = typeof raw === 'string' ? raw : ''
    })

    Object.entries(sanitizedSocial).forEach(([key, value]) => {
        if (typeof value === 'string') {
            social[key] = value
        }
    })

    return {
        name: { ...nameDefaults, ...(defaultValues?.name ?? {}) },
        description: { ...descriptionDefaults, ...(defaultValues?.description ?? {}) },
        slug: defaultValues?.slug ?? '',
        website_url: defaultValues?.website_url ?? '',
        logo_id: defaultValues?.logo_id ?? '',
        is_active: defaultValues?.is_active ?? true,
        social_links: social,
    }
}

export default function BrandForm({
    defaultValues,
    initialLogoUrl,
    onSubmit,
    formId = 'brand-form',
    apiErrors,
}: Props): JSX.Element {
    const { t } = useI18n()

    const schema = React.useMemo(() => createSchema(t), [t])
    const initialValues = React.useMemo(
        () => buildDefaultValues(defaultValues),
        [defaultValues],
    )

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(schema),
        defaultValues: initialValues,
        mode: 'onBlur',
    })

    const { handleSubmit, reset, setError } = form

    React.useEffect(() => {
        if (defaultValues) {
            reset(buildDefaultValues(defaultValues))
        }
    }, [defaultValues, reset])

    React.useEffect(() => {
        if (!apiErrors || apiErrors.length === 0) return
        apiErrors.forEach((err) => {
            if (!err.field) return
            const normalizedPath = err.field.replace(/\[(\w+)\]/g, '.$1')
            setError(normalizedPath as any, { type: 'server', message: err.message })
        })
    }, [apiErrors, setError])

    return (
        <FormProvider {...form}>
            <form
                id={formId}
                noValidate
                className="grid gap-6"
                onSubmit={handleSubmit((values) => {
                    const sanitizedName = cleanLocalizedField(values.name) ?? {}
                    const sanitizedDescription = cleanLocalizedField(values.description)
                    const sanitizedSocialLinks = cleanSocialLinks(values.social_links)

                    const payload: CreateBrandRequest = {
                        name: sanitizedName,
                        slug: values.slug.trim(),
                        is_active: values.is_active,
                    }

                    if (sanitizedDescription) {
                        payload.description = sanitizedDescription
                    }

                    const website = values.website_url?.trim()
                    if (website) {
                        const normalized = normalizeUrl(website)
                        if (normalized) {
                            payload.website_url = normalized
                        }
                    }

                    const logoId = values.logo_id?.trim()
                    if (logoId) {
                        payload.logo_id = logoId
                    }

                    if (sanitizedSocialLinks) {
                        payload.social_links = sanitizedSocialLinks
                    }

                    onSubmit(payload)
                })}
            >
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-semibold">
                            {t('brands.form.title')}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
                        <div className="flex flex-col gap-6">
                            <BrandGeneralFields />
                            <BrandMetadataFields />
                            <div>
                                <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                                    {t('brands.form.social_links')}
                                </h2>
                                <BrandSocialLinksFields />
                            </div>
                        </div>
                        <BrandLogoField initialLogoUrl={initialLogoUrl} />
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    )
}
