import { Controller, useFormContext } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useI18n } from '@/shared/hooks/useI18n'
import type { CategoryFormValues } from '@/features/categories/model/types'

type Props = Readonly<{ submitting?: boolean }>

export default function CategoryMetadataFields({ submitting = false }: Props) {
    const { t } = useI18n()
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<CategoryFormValues>()

    return (
        <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="category-slug">{t('categories.form.slug')}</Label>
                    <Input
                        id="category-slug"
                        placeholder={t('categories.form.slug_ph')}
                        autoComplete="off"
                        aria-invalid={Boolean(errors.slug)}
                        disabled={submitting}
                        {...register('slug')}
                    />
                    {errors.slug && (
                        <p className="mt-1 text-xs text-destructive">{errors.slug.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="category-sort-index">{t('categories.form.sort_index')}</Label>
                    <Input
                        id="category-sort-index"
                        type="number"
                        inputMode="numeric"
                        aria-invalid={Boolean(errors.sort_index)}
                        disabled={submitting}
                        {...register('sort_index', { valueAsNumber: true })}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                        {t('categories.form.sort_index_hint')}
                    </p>
                    {errors.sort_index && (
                        <p className="mt-1 text-xs text-destructive">{errors.sort_index.message}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-md border p-3">
                <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            checked={field.value}
                            onCheckedChange={(value) => field.onChange(Boolean(value))}
                            aria-label={t('categories.form.is_active_label')}
                            disabled={submitting}
                        />
                    )}
                />
                <div className="grid gap-1 text-sm">
                    <span className="font-medium">{t('categories.form.is_active_label')}</span>
                    <span className="text-xs text-muted-foreground">
                        {t('categories.form.is_active_hint')}
                    </span>
                </div>
            </div>
        </div>
    )
}
