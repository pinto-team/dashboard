// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
    globalIgnores(['node_modules', 'dist', 'build', '.next', 'coverage']),

    {
        files: ['**/*.{ts,tsx}'],

        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },

        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
        ],

        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: globals.browser,
        },

        rules: {
            // پایه را خاموش کن؛ فقط نسخه TS فعال باشد
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',   // پارامترهایی که با _ شروع می‌شن هشدار نمی‌گیرن
                    varsIgnorePattern: '^_',   // متغیرها هم همین‌طور (اگر لازم شد)
                    ignoreRestSiblings: true,
                },
            ],

            // React hooks + React Refresh
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': 'off',

        },
    },
])
