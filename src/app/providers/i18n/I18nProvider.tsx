import { type ReactNode, useEffect, useMemo, useState } from 'react'

import { type Locale, messages } from '@/shared/i18n/messages.ts'
import { convertDigitsByLocale } from '@/shared/i18n/numbers.ts'
import { getTextDirection, isRTLLocale } from '@/shared/i18n/utils.ts'

import { I18nCtx } from './i18n-context.ts'

export default function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(() => {
        const saved = localStorage.getItem('locale') as Locale | null
        return saved ?? 'en'
    })

    useEffect(() => {
        const root = document.documentElement
        const isRTL = isRTLLocale(locale)
        const direction = getTextDirection(locale)

        // تنظیم lang و dir روی html
        root.setAttribute('lang', locale)
        root.setAttribute('dir', direction)

        // اضافه/حذف کلاس RTL
        root.classList.toggle('rtl', isRTL)
        root.classList.toggle('ltr', !isRTL)

        // محاسبه عرض اسکرول و تنظیم padding برای جلوگیری از shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        if (isRTL) {
            root.style.paddingLeft = `${scrollbarWidth}px` // رزرو فضا در چپ برای اسکرول
            root.style.paddingRight = '0px'
        } else {
            root.style.paddingRight = `${scrollbarWidth}px` // رزرو فضا در راست برای LTR
            root.style.paddingLeft = '0px'
        }

        localStorage.setItem('locale', locale)
    }, [locale])

    const t = useMemo(() => {
        const dict = messages[locale] || {}
        return (key: string, params?: Record<string, string | number>) => {
            const template = dict[key] ?? key
            if (!params) return template
            return Object.keys(params).reduce((acc, k) => {
                const raw = params[k]!
                const value =
                    typeof raw === 'number' ? convertDigitsByLocale(raw, locale) : String(raw)
                return acc.replaceAll(`{${k}}`, value)
            }, template)
        }
    }, [locale])

    return <I18nCtx.Provider value={{ locale, setLocale, t }}>{children}</I18nCtx.Provider>
}
