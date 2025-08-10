import { Link, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { Search } from "lucide-react";

import { useI18n } from "@/shared/hooks/useI18n";
import LanguageToggle from "@/shared/components/LanguageToggle";
import ThemeToggle from "@/shared/components/ThemeToggle";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import AppSidebar from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const { t, locale } = useI18n();

  // Decide where to show trigger based on locale (RTL/LTR)
  const isRTL = useMemo(() => locale === "fa", [locale]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="min-h-dvh flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur border-border">
          <div className="container mx-auto flex items-center gap-3 p-3">
            {/* Sidebar trigger */}
            <SidebarTrigger className="lg:hidden" />

            {/* Brand (desktop) */}
            <Link to="/" className="font-bold hidden lg:inline">
              {t("appTitle")}
            </Link>

            {/* Search */}
            <div className="ms-0 lg:ms-6 flex-1">
              <div className="relative max-w-xl">
                <Search className="size-4 absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
                <Input placeholder="Search..." className="ps-9" />
              </div>
            </div>

            {/* Actions */}
            <div className="ms-auto flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Button variant="secondary" className="hidden md:inline-flex">{t("back")}</Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6 min-w-0">
          <Outlet />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
