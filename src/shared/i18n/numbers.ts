import type { Locale } from '@/shared/i18n/messages'

const LOCALE_MAP: Record<Locale, string> = {
    en: 'English',
    fa: 'فارسی',
}

export function formatNumber(
    value: number,
    locale: Locale,
    options?: Intl.NumberFormatOptions,
): string {
    const intlLocaleMap: Record<string, string> = {
        English: 'en-US',
        فارسی: 'fa-IR',
    }
    const resolvedLocale = intlLocaleMap[LOCALE_MAP[locale]] || 'en-US'
    return new Intl.NumberFormat(resolvedLocale, {
        maximumFractionDigits: 2,
        ...options,
    }).format(value)
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const

type DigitLiteral = (typeof PERSIAN_DIGITS)[number]

export function toScriptDigits(input: string | number, digits: readonly string[]): string {
    return String(input).replace(/[0-9]/g, (d) => digits[Number(d)] || d)
}

export function toEnglishDigits(input: string | number): string {
    const allDigits: readonly (readonly DigitLiteral[])[] = [PERSIAN_DIGITS]
    return String(input).replace(/[۰-۹০-৯०-९౦-౯]/g, (d: string) => {
        for (const digits of allDigits) {
            const index = digits.indexOf(d as DigitLiteral)
            if (index !== -1) return String(index)
        }
        return d
    })
}

export function toPersianDigits(input: string | number): string {
    return toScriptDigits(input, PERSIAN_DIGITS)
}

export function convertDigitsByLocale(input: string | number, locale: Locale): string {
    if (locale === 'fa') return toPersianDigits(input)
    return String(input)
}
