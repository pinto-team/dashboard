import {Link, Outlet} from "react-router-dom";
import {useMemo} from "react";

import {useI18n} from "@/shared/hooks/useI18n";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/core/sidebar/components/app-sidebar.tsx";

export default function DashboardLayout({children}: { children?: React.ReactNode }) {
    const {t, locale} = useI18n();

    // This memo remains in case we later need per-locale header tweaks
    useMemo(() => locale, [locale]);

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                {/* Header */}
                <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
                    <div className="container mx-auto flex items-center gap-3 p-3">
                        <SidebarTrigger/>
                        <Link to="/" className="font-bold">
                            {t("appTitle")}
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 md:p-6 min-w-0">
                    {children ?? <Outlet/>}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
