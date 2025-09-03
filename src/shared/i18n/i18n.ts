// shared/i18n/i18n.ts
import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'

import enTranslations from './locales/en.json'
import faTranslations from './locales/fa.json'

// Initialize i18next
i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslations },
        fa: { translation: faTranslations },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes values
    },
    debug: import.meta.env.DEV,
})

export default i18n
