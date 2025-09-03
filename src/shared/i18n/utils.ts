import type { Locale } from './messages'

// Define RTL languages
export const RTL_LANGUAGES: Locale[] = ['fa']

// Check if a locale is RTL
export const isRTLLocale = (locale: Locale): boolean => {
    return RTL_LANGUAGES.includes(locale)
}

// Get text direction for a locale
export const getTextDirection = (locale: Locale): 'ltr' | 'rtl' => {
    return isRTLLocale(locale) ? 'rtl' : 'ltr'
}

// Get sidebar side for a locale
export const getSidebarSide = (locale: Locale): 'left' | 'right' => {
    return isRTLLocale(locale) ? 'right' : 'left'
}

// Get text alignment class (using logical 'text-start')
export const getTextAlignClass = (locale: Locale): string => {
    return 'text-start'
}

// Get flex direction for RTL support
export const getFlexDirection = (
    locale: Locale,
    baseDirection: 'row' | 'row-reverse' | 'col' | 'col-reverse',
): string => {
    if (!isRTLLocale(locale)) return baseDirection
    if (baseDirection === 'row') return 'row-reverse'
    if (baseDirection === 'row-reverse') return 'row'
    return baseDirection
}

// Get justify content for RTL support (using logical equivalents)
export const getJustifyContent = (locale: Locale, baseJustify: string): string => {
    if (!isRTLLocale(locale)) return baseJustify
    if (baseJustify === 'justify-start') return 'justify-end'
    if (baseJustify === 'justify-end') return 'justify-start'
    return baseJustify
}

// Get items alignment for RTL support
export const getItemsAlignment = (locale: Locale, baseAlign: string): string => {
    if (!isRTLLocale(locale)) return baseAlign
    if (baseAlign === 'items-start') return 'items-end'
    if (baseAlign === 'items-end') return 'items-start'
    return baseAlign
}

// Get self alignment for RTL support
export const getSelfAlignment = (locale: Locale, baseAlign: string): string => {
    if (!isRTLLocale(locale)) return baseAlign
    if (baseAlign === 'self-start') return 'self-end'
    if (baseAlign === 'self-end') return 'self-start'
    return baseAlign
}

// Get transform for RTL support (useful for icons)
export const getRTLTransform = (locale: Locale, baseTransform?: string): string => {
    if (!isRTLLocale(locale)) return baseTransform || ''
    if (!baseTransform) return '-scale-x-100'
    return `${baseTransform} -scale-x-100`
}

// Get locale display name
export const getLocaleDisplayName = (locale: Locale): string => {
    const names: Record<Locale, string> = {
        en: 'English',
        fa: 'فارسی',
    }
    return names[locale] || locale
}
