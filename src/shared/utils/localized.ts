import type { Locale } from '@/shared/i18n/messages'
import { normalizeSocialLinkKey } from '@/shared/constants/socialLinks'
import type { SocialLinkKey } from '@/shared/constants/socialLinks'

const LOCALE_CANONICAL_MAP: Record<string, string> = {
    en: 'en-US',
    'en-us': 'en-US',
    'en_us': 'en-US',
    fa: 'fa-IR',
    'fa-ir': 'fa-IR',
    'fa_ir': 'fa-IR',
}

const LOCALE_CANDIDATES: Record<string, ReadonlyArray<string>> = {
    'en-US': ['en-US', 'en', 'en-us', 'en_us'],
    'fa-IR': ['fa-IR', 'fa', 'fa-ir', 'fa_ir'],
}

export type LocalizedValue = Record<string, string | null | undefined>

function canonicalizeLocaleKey(locale: string | null | undefined): string {
    const trimmed = locale?.trim()
    if (!trimmed) return ''
    const lower = trimmed.toLowerCase()
    return LOCALE_CANONICAL_MAP[lower] ?? trimmed
}

function getLocaleCandidates(locale: string | null | undefined): ReadonlyArray<string> {
    const canonical = canonicalizeLocaleKey(locale)
    if (!canonical) return []
    return LOCALE_CANDIDATES[canonical] ?? [canonical, canonical.toLowerCase()]
}

function createLocalizedLookup(field: LocalizedValue): Map<string, string> {
    const map = new Map<string, string>()
    Object.entries(field).forEach(([rawKey, value]) => {
        if (typeof value !== 'string') return
        const trimmedKey = rawKey.trim()
        if (!trimmedKey) return

        const canonical = canonicalizeLocaleKey(trimmedKey)
        map.set(trimmedKey, value)
        map.set(trimmedKey.toLowerCase(), value)
        if (canonical) {
            map.set(canonical, value)
            map.set(canonical.toLowerCase(), value)
        }
    })
    return map
}

export function getLocalizedValue(
    field: LocalizedValue | string | null | undefined,
    locale: Locale,
    fallback: Locale = 'en',
): string {
    if (!field) return ''
    if (typeof field === 'string') return field

    const lookup = createLocalizedLookup(field)

    const localeCandidates = getLocaleCandidates(locale)
    for (const candidate of localeCandidates) {
        const value = lookup.get(candidate) ?? lookup.get(candidate.toLowerCase())
        if (value && value.trim().length > 0) {
            return value
        }
    }

    const fallbackCandidates = getLocaleCandidates(fallback)
    for (const candidate of fallbackCandidates) {
        const value = lookup.get(candidate) ?? lookup.get(candidate.toLowerCase())
        if (value && value.trim().length > 0) {
            return value
        }
    }

    for (const value of lookup.values()) {
        if (value && value.trim().length > 0) {
            return value
        }
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
            const normalizedKey = canonicalizeLocaleKey(key)
            result[normalizedKey || key] = trimmed
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
    const lookup = field ? createLocalizedLookup(field) : new Map<string, string>()

    locales.forEach((locale) => {
        let resolved = ''
        const candidates = getLocaleCandidates(locale)
        for (const candidate of candidates) {
            const value = lookup.get(candidate) ?? lookup.get(candidate.toLowerCase())
            if (typeof value === 'string') {
                resolved = value
                break
            }
        }
        result[locale] = resolved
    })
    return result
}
