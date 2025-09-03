// shared/i18n/useTranslation.ts
import type { TOptions } from 'i18next'

import { useTranslation as useI18nTranslation } from 'react-i18next'

import type { LocaleKey } from './en.ts'

export function useTranslation() {
    const { t, i18n } = useI18nTranslation()

    const translate = (key: LocaleKey, options?: TOptions) => {
        return t(key, options)
    }

    return {
        t: translate,
        i18n,
        currentLanguage: i18n.language,
        changeLanguage: i18n.changeLanguage,
    }
}
