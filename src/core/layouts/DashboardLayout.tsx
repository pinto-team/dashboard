import { Link, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { Menu, Search } from "lucide-react";

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
import { Input } from "@/shared/components/ui/input";

import SidebarNav from "./SidebarNav";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const { t, locale } = useI18n();

  const sheetSide = useMemo<"left" | "right">(() => (locale === "fa" ? "right" : "left"), [locale]);

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr] bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur border-border">
        <div className="container mx-auto flex items-center gap-3 p-3">
          {/* Mobile menu trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side={sheetSide} className="w-72 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
                <div className="p-4 border-b border-sidebar-border">
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

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-0">
        {/* Static sidebar (desktop) */}
        <aside className="hidden lg:flex lg:flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground">
          <div className="p-4 border-b border-sidebar-border font-bold">{t("appTitle")}</div>
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
