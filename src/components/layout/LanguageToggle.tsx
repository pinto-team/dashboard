import { Check, Globe } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { useI18n } from '@/shared/hooks/useI18n.ts'
import type { Locale } from '@/shared/i18n/messages.ts'
import { getLocaleDisplayName, getTextDirection } from '@/shared/i18n/utils.ts'

const LANGS: { code: Locale }[] = [{ code: 'en' }, { code: 'fa' }]

export default function LanguageToggle() {
    const { locale, setLocale, t } = useI18n()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="font-medium">
                    <Globe className="w-5 h-5 rtl:-scale-x-100" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="min-w-44 text-start"
                style={{ direction: getTextDirection(locale) }}
            >
                <DropdownMenuLabel>{t('changeLanguage')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGS.map((l) => (
                    <DropdownMenuItem
                        key={l.code}
                        onSelect={() => setLocale(l.code)}
                        className="flex items-center justify-between gap-x-2 ps-2"
                    >
                        <span>{getLocaleDisplayName(l.code)}</span>
                        {locale === l.code ? <Check className="w-4 h-4 rtl:-scale-x-100" /> : null}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
