import { useContext } from 'react'

import { I18nCtx } from '@/app/providers/i18n/i18n-context.ts'

export function useI18n() {
    const ctx = useContext(I18nCtx)
    if (!ctx) throw new Error('useI18n must be used within I18nProvider')
    return ctx
}
