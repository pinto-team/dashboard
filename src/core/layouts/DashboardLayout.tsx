import { Link, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { Menu } from "lucide-react";

import { useI18n } from "@/shared/hooks/useI18n";
import LanguageToggle from "@/shared/components/LanguageToggle";
import ThemeToggle from "@/shared/components/ThemeToggle";

import { Button } from "@/shared/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import SidebarNav from "./SidebarNav";

export default function DashboardLayout() {
    const { t, locale } = useI18n();

    const sheetSide = useMemo<"left" | "right">(
        () => (locale === "fa" ? "right" : "left"),
        [locale]
    );

    return (
        <div className="min-h-dvh grid grid-rows-[auto_1fr] bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur p-3 flex items-center gap-3">
                {/* Mobile menu trigger */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Open menu">
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={sheetSide} className="w-72 p-0">
                            <div className="p-4 border-b">
                                <SheetHeader>
                                    <SheetTitle>{t("appTitle")}</SheetTitle>
                                </SheetHeader>
                            </div>
                            <ScrollArea className="h-[calc(100vh-4rem)] p-4">
                                <SidebarNav />
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Brand (desktop) */}
                <Link to="/" className="font-bold hidden lg:inline">
                    {t("appTitle")}
                </Link>

                <div className="ms-auto flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </header>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-0">
                {/* Static sidebar (desktop) */}
                <aside className="hidden lg:flex lg:flex-col border-e">
                    <div className="p-4 border-b font-bold">{t("appTitle")}</div>
                    <ScrollArea className="flex-1 p-4">
                        <SidebarNav />
                    </ScrollArea>
                </aside>

                {/* Content */}
                <main className="p-4 md:p-6 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
