// features/auth/components/LoginForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useI18n } from '@/shared/hooks/useI18n'

const schema = z.object({
    username: z.string().min(3, 'validation.usernameMin'),
    password: z.string().min(3, 'validation.passwordMin'),
})

export type LoginFormValues = z.infer<typeof schema>

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
    onFormSubmit: (_data: LoginFormValues) => void | Promise<void> // eslint-disable-line no-unused-vars
    loading?: boolean
    errorMessage?: string
}

export default function LoginForm({
    onFormSubmit,
    loading,
    errorMessage,
    className,
    ...props
}: LoginFormProps) {
    const { t } = useI18n()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { username: '', password: '' },
        mode: 'onTouched',
    })

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="p-6 md:p-8">
                    {/* ✅ اینجا دیگه data استفاده میشه، خطای ESLint از بین میره */}
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="grid gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">{t('login.title')}</h1>
                                <p className="text-muted-foreground text-balance">
                                    {t('login.subtitle')}
                                </p>
                            </div>

                            {/* Username */}
                            <div className="grid gap-3">
                                <Label htmlFor="username">{t('username')}</Label>
                                <Input
                                    id="username"
                                    {...register('username')}
                                    placeholder={t('login.usernamePlaceholder')}
                                    dir="ltr"
                                />
                                {errors.username && (
                                    <p className="text-xs text-destructive">
                                        {t(errors.username.message as string)}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">{t('password')}</Label>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        {t('login.forgotPassword')}
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    placeholder={t('login.passwordPlaceholder')}
                                    dir="ltr"
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive">
                                        {t(errors.password.message as string)}
                                    </p>
                                )}
                            </div>

                            {/* Error message */}
                            {errorMessage && (
                                <div className="text-sm text-destructive border border-destructive/30 rounded-md p-2">
                                    {errorMessage}
                                </div>
                            )}

                            {/* Submit */}
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? t('loading') : t('signIn')}
                            </Button>

                            {/* Sample creds */}
                            <p className="text-xs opacity-70 text-muted-foreground text-center"></p>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Terms */}
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                {t('login.agreePrefix')} <a href="#">{t('login.terms')}</a> {t('login.and')}{' '}
                <a href="#">{t('login.privacy')}</a>.
            </div>
        </div>
    )
}
