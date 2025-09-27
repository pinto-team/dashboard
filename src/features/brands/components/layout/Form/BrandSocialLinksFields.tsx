import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import type { BrandFormValues } from '@/features/brands/model/types.ts'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import { useFormContext } from 'react-hook-form'

export default function BrandSocialLinksFields() {
    const { t } = useI18n()
    const {
        register,
        formState: { errors },
    } = useFormContext<BrandFormValues>()

    const socialErrors = errors.social_links ?? {}

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <Label htmlFor="brand-social-instagram">
                    {t('brands.form.social.instagram')}
                </Label>
                <Input
                    id="brand-social-instagram"
                    placeholder={t('brands.form.social.instagram_ph')}
                    autoComplete="url"
                    {...register('social_links.instagram')}
                />
                {socialErrors.instagram && (
                    <p className="mt-1 text-xs text-destructive">
                        {socialErrors.instagram.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="brand-social-telegram">
                    {t('brands.form.social.telegram')}
                </Label>
                <Input
                    id="brand-social-telegram"
                    placeholder={t('brands.form.social.telegram_ph')}
                    autoComplete="url"
                    {...register('social_links.telegram')}
                />
                {socialErrors.telegram && (
                    <p className="mt-1 text-xs text-destructive">
                        {socialErrors.telegram.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="brand-social-linkedin">
                    {t('brands.form.social.linkedin')}
                </Label>
                <Input
                    id="brand-social-linkedin"
                    placeholder={t('brands.form.social.linkedin_ph')}
                    autoComplete="url"
                    {...register('social_links.linkedin')}
                />
                {socialErrors.linkedin && (
                    <p className="mt-1 text-xs text-destructive">
                        {socialErrors.linkedin.message}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="brand-social-x">
                    {t('brands.form.social.x')}
                </Label>
                <Input
                    id="brand-social-x"
                    placeholder={t('brands.form.social.x_ph')}
                    autoComplete="url"
                    {...register('social_links.x')}
                />
                {socialErrors.x && (
                    <p className="mt-1 text-xs text-destructive">
                        {socialErrors.x.message}
                    </p>
                )}
            </div>
        </div>
    )
}
