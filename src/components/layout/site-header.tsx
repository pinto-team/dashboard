import LanguageToggle from '@/components/layout/LanguageToggle.tsx'
import ThemeToggle from '@/components/layout/ThemeToggle.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { SidebarTrigger } from '@/components/ui/sidebar.tsx'
import { useI18n } from '@/shared/hooks/useI18n'

export function SiteHeader() {
    const { t } = useI18n()

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center justify-between px-4 lg:px-6 gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />
                    <h1 className="text-base font-medium">
                        <span>{t('nav.documents')}</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
