import { Dispatch, SetStateAction, createContext } from 'react'

import type { Locale } from '@/shared/i18n/messages'

export type I18nCtxType = {
    locale: Locale
    setLocale: Dispatch<SetStateAction<Locale>>
    t: (key: string, params?: Record<string, string | number>) => string
}

export const I18nCtx = createContext<I18nCtxType | null>(null)
