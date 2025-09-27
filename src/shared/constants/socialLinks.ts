export const SOCIAL_LINK_KEYS = [
    'facebook',
    'instagram',
    'x',
    'linkedin',
    'youtube',
    'tiktok',
    'snapchat',
    'whatsapp',
    'telegram',
    'signal',
    'viber',
    'wechat',
    'line',
    'discord',
    'skype',
    'reddit',
    'bale',
    'eitaa',
    'rubika',
    'soroush',
    'igap',
    'gap',
    'bisphone',
    'wispi',
] as const

export type SocialLinkKey = (typeof SOCIAL_LINK_KEYS)[number]

const ALIAS_MAP: Record<string, SocialLinkKey> = {
    twitter: 'x',
}

const SOCIAL_KEY_SET = new Set<string>(SOCIAL_LINK_KEYS)

export function normalizeSocialLinkKey(key: string | null | undefined): SocialLinkKey | undefined {
    if (!key) return undefined
    const normalized = key.trim().toLowerCase()
    if (!normalized) return undefined

    if (ALIAS_MAP[normalized]) {
        return ALIAS_MAP[normalized]
    }

    return SOCIAL_KEY_SET.has(normalized) ? (normalized as SocialLinkKey) : undefined
}

export function isSupportedSocialLinkKey(key: string): key is SocialLinkKey {
    return SOCIAL_KEY_SET.has(key)
}
