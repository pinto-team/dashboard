// features/auth/pages/LoginPage.tsx
import { useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import LanguageToggle from '@/components/layout/LanguageToggle.tsx'
import ThemeToggle from '@/components/layout/ThemeToggle.tsx'
import LoginForm, { LoginFormValues } from '@/features/auth/components/LoginForm'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTranslation } from '@/shared/i18n/useTranslation'

type FromState = { from?: { pathname?: string } }

export default function LoginPage() {
    const { login } = useAuth()
    const { t } = useTranslation()
    const nav = useNavigate()
    const loc = useLocation()
    const state = loc.state as FromState | undefined
    const from = state?.from?.pathname ?? '/dashboard'
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    async function handleSubmit(values: LoginFormValues): Promise<void> {
        setLoading(true)
        setErrorMessage(null)
        try {
            await login(values)
            nav(from, { replace: true })
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : t('errors.auth.loginFailed')
            setErrorMessage(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="absolute right-6 top-6 flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
            </div>
            <div className="w-full max-w-sm md:max-w-md">
                <LoginForm
                    onFormSubmit={handleSubmit}
                    loading={loading}
                    errorMessage={errorMessage ?? undefined}
                />
            </div>
        </div>
    )
}
