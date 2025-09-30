/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly VITE_AUTH_API_URL?: string
    readonly VITE_CATALOG_API_URL?: string
    readonly VITE_FILES_API_URL?: string
    readonly VITE_BRANDS_API_URL?: string
    readonly VITE_CATEGORIES_API_URL?: string
    readonly VITE_PRODUCTS_API_URL?: string
    readonly VITE_SESSIONS_API_URL?: string
    readonly VITE_ENABLE_MSW?: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    // 🔹 هر متغیر env دیگه‌ای که داری اینجا declare کن
    readonly [key: string]: string | undefined
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
