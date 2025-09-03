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

    // ---------- Zod schema (بر اساس createFields) ----------
    const schema = React.useMemo(
    () =>
    z.object({
            name: z.string().trim()
            .min(1, t('validation.required')).min(2, t('validation.min_length', { n: 2 }))
            ,





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
    } as CreateCategoryRequest
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




            </div>
        </CardContent>
    </Card>
    </form>
    )
    }
