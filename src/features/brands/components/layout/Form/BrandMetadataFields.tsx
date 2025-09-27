import { Controller, useFormContext } from 'react-hook-form'

import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import type { BrandFormValues } from '@/features/brands/model/types.ts'

export default function BrandMetadataFields() {
    const { t } = useI18n()
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<BrandFormValues>()

    return (
        <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="brand-slug">{t('brands.form.slug')}</Label>
                    <Input
                        id="brand-slug"
                        placeholder={t('brands.form.slug_ph')}
                        autoComplete="off"
                        aria-invalid={Boolean(errors.slug)}
                        {...register('slug')}
                    />
                    {errors.slug && (
                        <p className="mt-1 text-xs text-destructive">{errors.slug.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="brand-website">{t('brands.form.website_url')}</Label>
                    <Input
                        id="brand-website"
                        placeholder={t('brands.form.website_url_ph')}
                        inputMode="url"
                        autoComplete="url"
                        aria-invalid={Boolean(errors.website_url)}
                        {...register('website_url')}
                    />
                    {errors.website_url && (
                        <p className="mt-1 text-xs text-destructive">
                            {errors.website_url.message}
                        </p>
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
                            aria-label={t('brands.form.is_active_label')}
                        />
                    )}
                />
                <div className="grid gap-1 text-sm">
                    <span className="font-medium">
                        {t('brands.form.is_active_label')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {t('brands.form.is_active_hint')}
                    </span>
                </div>
            </div>
        </div>
    )
}
