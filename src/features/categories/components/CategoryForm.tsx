import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import CategoryImageField from '@/features/categories/components/CategoryImageField'
import type { CreateCategoryRequest } from '@/features/categories/model/types'

type CategoryFormValues = {
    name: string
    description?: string
    image_id?: string
}

type Props = Readonly<{
    defaultValues?: Partial<CategoryFormValues>
    initialImageUrl?: string | null
    onSubmit: (data: CreateCategoryRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
}>

export default function CategoryForm({
                                         defaultValues,
                                         initialImageUrl,
                                         onSubmit,
                                         submitting = false,
                                         formId = 'category-form',
                                         apiErrors,
                                     }: Props) {
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
                image_id: z.union([z.string(), z.literal('')]).optional(),
            }),
        [t],
    )

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            image_id: '',
            ...defaultValues,
        },
        mode: 'onBlur',
    })

    const { handleSubmit, reset, setError, formState } = form

    React.useEffect(() => {
        if (defaultValues) {
            reset({
                name: defaultValues.name ?? '',
                description: defaultValues.description ?? '',
                image_id: defaultValues.image_id ?? '',
            })
        }
    }, [defaultValues, reset])

    React.useEffect(() => {
        if (!apiErrors || apiErrors.length === 0) return
        apiErrors.forEach((err) => {
            const path = err.field?.split('.')?.pop() ?? err.field
            if (path === 'name' || path === 'description' || path === 'image_id') {
                setError(path as keyof CategoryFormValues, {
                    type: 'server',
                    message: err.message,
                })
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
                    const cleaned: CreateCategoryRequest = {
                        name: values.name.trim(),
                        description: values.description?.trim() || '',
                        image_id: values.image_id?.trim() || '',
                    }
                    onSubmit(cleaned)
                })}
            >
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-semibold">
                            {t('categories.form.title')}
                        </CardTitle>
                    </CardHeader>

                    {/* ⬇️ تغییر اصلی: دو ستونه مثل برند */}
                    <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                        {/* ستون چپ: فیلدهای متن */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="category-name">
                                    {t('categories.form.name')}*
                                </Label>
                                <Input
                                    id="category-name"
                                    placeholder={t('categories.form.name_ph')}
                                    aria-invalid={Boolean(formState.errors.name)}
                                    {...form.register('name')}
                                />
                                {formState.errors.name && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {formState.errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="category-description">
                                    {t('categories.form.description')}
                                </Label>
                                <textarea
                                    id="category-description"
                                    placeholder={t('categories.form.description_ph')}
                                    className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-invalid={Boolean(formState.errors.description)}
                                    {...form.register('description')}
                                />
                                {formState.errors.description && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {formState.errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ستون راست: تصویر دسته‌بندی (مثل BrandLogoField) */}
                        <div className="self-start">
                            <CategoryImageField initialImageUrl={initialImageUrl} />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    )
}
