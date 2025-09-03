// src/shared/utils/getInitials.ts
export function getInitials(name: string, maxLetters = 2): string {
    if (!name) return '??'

    const clean = name.trim().replace(/\s+/g, ' ')
    if (!clean) return '??'

    // Split name into words
    const parts = clean.split(' ').filter(Boolean)

    // Helper: Get the first Unicode grapheme/character from a string
    const firstGrapheme = (s: string) => Array.from(s)[0] ?? ''

    // If there are at least two words: take the first letter of the first two words
    if (parts.length >= 2) {
        const initials = parts.slice(0, maxLetters).map(firstGrapheme).join('')
        return initials || '??'
    }

    // If one word: take the first two graphemes/characters of the word
    const only = parts[0]
    const graphemes = Array.from(only).slice(0, maxLetters).join('')
    return graphemes || '??'
}
