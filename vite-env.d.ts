/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    // 🔹 هر متغیر env دیگه‌ای که داری اینجا declare کن
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
