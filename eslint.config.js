// eslint.config.js
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,            // فقط قواعد پایه جاوااسکریپت
            tseslint.configs.recommended,      // فقط قواعد ضروری تایپ‌اسکریپت
            reactHooks.configs['recommended'], // قواعد ضروری هوک‌ها
            reactRefresh.configs.vite,         // برای HMR و React Refresh
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            // همه رو warning بذار تا فقط errorهای حیاتی بیاد
            'no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            'react-refresh/only-export-components': 'warn',
        },
    },
])