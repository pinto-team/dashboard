import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import * as React from 'react'
import { JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import { CreateWarehouseRequest } from '@/features/warehouses/model/types'

type Props = Readonly<{
defaultValues?: Partial<CreateWarehouseRequest>
    onSubmit: (data: CreateWarehouseRequest) => void
    submitting?: boolean
    formId?: string
    apiErrors?: ReadonlyArray<{ field: string; message: string }>
    }>

    export default function WarehouseForm({
    defaultValues,
    onSubmit,
    submitting = false,
    formId = 'warehouse-form',
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





            location: z.string().trim()
            
            ,






            capacity: z.number({ invalid_type_error: t('validation.number') }),









            manager_id: z.any(),
    }),
    [t],
    )

    const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    } = useForm<CreateWarehouseRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
            name: '',
            location: '',
            capacity: 0,
            manager_id: undefined,
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
        if (path === 'location') {
        setError('location' as any, {
        type: 'server',
        message: err.message,
        })
        }
        if (path === 'capacity') {
        setError('capacity' as any, {
        type: 'server',
        message: err.message,
        })
        }
        if (path === 'manager_id') {
        setError('manager_id' as any, {
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
            location: (values.location ?? '').toString().trim(),
            capacity: typeof values.capacity === 'number'
            ? values.capacity
            : Number(values.capacity ?? 0),
            manager_id: values.manager_id,
    } as CreateWarehouseRequest
    onSubmit(cleaned)
    })}
    >
    <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg font-semibold">
                {t('warehouse.form.title')}
            </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="warehouse-name">
                                    {t('warehouse.form.name')}*
                                </Label>
                                <Input
                                    id="warehouse-name"
                                    placeholder={t('warehouse.form.name_ph')}
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
                                <Label htmlFor="warehouse-location">
                                    {t('warehouse.form.location')}
                                </Label>
                                <Input
                                    id="warehouse-location"
                                    placeholder={t('warehouse.form.location_ph')}
                                    autoComplete="off"
                                    aria-invalid={Boolean(errors.location)}
                                    {...register('location' as const)}
                                />
                                {errors.location && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.location.message as string}
                                </p>
                                )}
                            </div>





                        <div>
                            <Label htmlFor="warehouse-capacity">
                                {t('warehouse.form.capacity')}
                            </Label>
                            <Input
                                id="warehouse-capacity"
                                type="number"
                                inputMode="decimal"
                                aria-invalid={Boolean(errors.capacity)}
                                {...register('capacity' as const, { valueAsNumber: true })}
                            />
                            {errors.capacity && (
                            <p className="mt-1 text-xs text-destructive">
                                {errors.capacity.message as string}
                            </p>
                            )}
                        </div>







                        <div>
                            <Label htmlFor="warehouse-manager_id">
                                {t('warehouse.form.manager_id')}
                            </Label>
                            <Input
                                id="warehouse-manager_id"
                                aria-invalid={Boolean(errors.manager_id)}
                                {...register('manager_id' as const)}
                            />
                            {errors.manager_id && (
                            <p className="mt-1 text-xs text-destructive">
                                {String(errors.manager_id.message)}
                            </p>
                            )}
                        </div>
            </div>
        </CardContent>
    </Card>
    </form>
    )
    }
