import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import * as React from 'react'
import { JSX } from 'react'

import { useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import { CreateCategoryRequest } from '@/features/categories/model/types'
// ⚠️ اگر uploader خاصی داشتیم باید بعداً جداگانه بسازیم
// import CategoryLogoUploader from '@/features/categories/components/CategoryLogoUploader'

type Props = Readonly<{
defaultValues?: Partial<CreateCategoryRequest>
    onSubmit: (data: CreateCategoryRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
    }>

    export default function CategoryForm({
    defaultValues,
    onSubmit,
    submitting = false,
    formId = 'category-form',
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
    }),
    [t],
    )

    const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    } = useForm<CreateCategoryRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
    name: '',
    description: '',
    ...defaultValues,
    },
    mode: 'onBlur',
    })

    React.useEffect(() => {
    if (defaultValues) {
    reset({
    name: defaultValues.name ?? '',
    description: defaultValues.description ?? '',
    })
    }
    }, [defaultValues, reset])

    React.useEffect(() => {
    if (!apiErrors || apiErrors.length === 0) return
    apiErrors.forEach((err) => {
    const path = err.field?.split('.')?.pop() ?? err.field
    if (path === 'name' || path === 'description') {
    setError(path as keyof CreateCategoryRequest, {
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
    const cleaned: CreateCategoryRequest = {
    name: values.name.trim(),
    description: values.description?.trim() || '',
    }
    onSubmit(cleaned)
    })}
    >
    <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg font-semibold">
                {t('category.form.title')}
            </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
                <div>
                    <Label htmlFor="category-name">
                        {t('category.form.name')}*
                    </Label>
                    <Input
                        id="category-name"
                        placeholder={t('category.form.name_ph')}
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

                <div>
                    <Label htmlFor="category-description">
                        {t('category.form.description')}
                    </Label>
                    <textarea
                        id="category-description"
                        placeholder={t('category.form.description_ph')}
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
        </CardContent>
    </Card>
    </form>
    )
    }