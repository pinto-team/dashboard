const MAX_SLUG_LENGTH = 255

function normalizeInput(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
}

function sanitizeSlug(value: string): string {
    return value
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, MAX_SLUG_LENGTH)
}

export function slugify(input: string, fallbackPrefix = 'item'): string {
    const normalized = sanitizeSlug(normalizeInput(input))
    if (normalized.length > 0) {
        return normalized
    }

    const randomSegment = Math.random().toString(36).slice(2, 8)
    const fallback = `${fallbackPrefix}-${randomSegment}`
    return sanitizeSlug(fallback) || 'item'
}
