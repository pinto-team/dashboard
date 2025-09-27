import type { Locale } from '@/shared/i18n/messages'
import { normalizeSocialLinkKey } from '@/shared/constants/socialLinks'
import type { SocialLinkKey } from '@/shared/constants/socialLinks'

export type LocalizedValue = Record<string, string | null | undefined>

export function getLocalizedValue(
    field: LocalizedValue | string | null | undefined,
    locale: Locale,
    fallback: Locale = 'en',
): string {
    if (!field) return ''
    if (typeof field === 'string') return field

    const normalizedLocale = locale.toLowerCase()
    const normalizedFallback = fallback.toLowerCase()

    const direct = field[normalizedLocale] ?? field[locale]
    if (direct && typeof direct === 'string' && direct.trim().length > 0) {
        return direct
    }

    const fallbackValue =
        field[normalizedFallback] ?? field[fallback] ?? firstNonEmptyValue(field)
    if (fallbackValue && typeof fallbackValue === 'string') {
        return fallbackValue
    }

    return ''
}

export function cleanLocalizedField(
    field?: LocalizedValue,
): Record<string, string> | undefined {
    if (!field) return undefined

    const result: Record<string, string> = {}
    Object.entries(field).forEach(([key, value]) => {
        const trimmed = value?.trim()
        if (trimmed) {
            result[key] = trimmed
        }
    })

    return Object.keys(result).length > 0 ? result : undefined
}

export function cleanSocialLinks(
    links?: Record<string, string | null | undefined>,
): Partial<Record<SocialLinkKey, string>> | undefined {
    if (!links) return undefined

    const result: Partial<Record<SocialLinkKey, string>> = {}
    let hasValue = false

    Object.entries(links).forEach(([rawKey, value]) => {
        const normalizedRawKey = rawKey.trim().toLowerCase()
        const key = normalizeSocialLinkKey(normalizedRawKey)
        if (!key) return

        const trimmed = value?.trim?.()
        if (!trimmed) return

        if (result[key] && normalizedRawKey !== key) return

        result[key] = trimmed
        hasValue = true
    })

    return hasValue ? result : undefined
}

export function ensureLocalizedDefaults(
    field: LocalizedValue | undefined,
    locales: ReadonlyArray<string>,
): Record<string, string> {
    const result: Record<string, string> = {}
    locales.forEach((locale) => {
        const value = field?.[locale]
        result[locale] = typeof value === 'string' ? value : ''
    })
    return result
}

function firstNonEmptyValue(field: LocalizedValue): string | undefined {
    for (const value of Object.values(field)) {
        if (typeof value === 'string' && value.trim().length > 0) {
            return value
        }
    }
    return undefined
}
