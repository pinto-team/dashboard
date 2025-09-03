// Import translations from JSON files
import enTranslations from './locales/en.json'
import faTranslations from './locales/fa.json'

export type Locale = 'en' | 'fa'

export const messages: Record<Locale, Record<string, string>> = {
    en: enTranslations,
    fa: faTranslations,
}
