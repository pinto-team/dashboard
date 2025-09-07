import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import type { CreateCategoryRequest } from '@/features/categories/model/types'
import { categoriesQueries } from '@/features/categories'
import CategoryImageField from './CategoryImageField.tsx'

type Props = Readonly<{
    defaultValues?: Partial<CreateCategoryRequest>
    onSubmit: (data: CreateCategoryRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
    initialImageUrl?: string | null
}>

export default function CategoryForm({
    defaultValues,
    onSubmit,
    submitting = false,
    formId = 'category-form',
    apiErrors,
    initialImageUrl,
}: Props) {
    const { t } = useI18n()

    const schema = React.useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, t('validation.required'))
                    .max(120, t('validation.max_length', { n: 120 })),
                description: z
                    .union([z.string().max(500, t('validation.max_length', { n: 500 })), z.literal('')])
                    .optional(),
                parent_id: z.union([z.string(), z.literal('')]).optional(),
                image_id: z.union([z.string(), z.literal('')]).optional(),
            }),
        [t],
    )

    const form = useForm<CreateCategoryRequest>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            parent_id: '',
            image_id: '',
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
                parent_id: defaultValues.parent_id ?? '',
                image_id: defaultValues.image_id ?? '',
            })
        }
    }, [defaultValues, reset])

    React.useEffect(() => {
        if (!apiErrors || apiErrors.length === 0) return
        apiErrors.forEach((err) => {
            const path = err.field?.split('.')?.pop() ?? err.field
            if (path === 'name' || path === 'description' || path === 'parent_id' || path === 'image_id') {
                setError(path as keyof CreateCategoryRequest, { type: 'server', message: err.message })
            }
        })
    }, [apiErrors, setError])

    const parentListParams = React.useMemo(() => ({ page: 1, limit: 100 }), [])
    const parentsQuery = categoriesQueries.useList(parentListParams)
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
                        parent_id: values.parent_id?.trim() || '',
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
                    <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="category-name">{t('categories.form.name')}*</Label>
                                <Input
                                    id="category-name"
                                    placeholder={t('categories.form.name_ph') as string}
                                    autoComplete="off"
                                    aria-invalid={Boolean(form.formState.errors.name)}
                                    {...form.register('name')}
                                />
                                {form.formState.errors.name && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="category-description">{t('categories.form.description')}</Label>
                                <textarea
                                    id="category-description"
                                    placeholder={t('categories.form.description_ph') as string}
                                    className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-invalid={Boolean(form.formState.errors.description)}
                                    {...form.register('description')}
                                />
                                {form.formState.errors.description && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {form.formState.errors.description.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="category-parent">{t('categories.form.parent_id')}</Label>
                                <Select
                                    value={form.watch('parent_id') || ''}
                                    onValueChange={(val) =>
                                        form.setValue('parent_id', val, { shouldDirty: true })
                                    }
                                >
                                    <SelectTrigger id="category-parent" className="w-full">
                                        <SelectValue
                                            placeholder={t('categories.form.parent_id_ph') as string}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">
                                            {t('categories.form.parent_none')}
                                        </SelectItem>
                                        {parentsQuery.data?.data.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.parent_id && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {form.formState.errors.parent_id.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <CategoryImageField initialImageUrl={initialImageUrl} />
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    )
}
