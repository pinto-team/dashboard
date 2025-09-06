import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import { useFormContext } from 'react-hook-form'
import { CreateBrandRequest } from '@/features/brands/model/types.ts'

export default function BrandCountryWebsiteFields() {
    const { t } = useI18n()
    const {
        register,
        formState: { errors },
    } = useFormContext<CreateBrandRequest>()

    return (
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
    )
}
