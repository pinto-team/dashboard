import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { Menu } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";
import LanguageToggle from "@/shared/components/LanguageToggle";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import SidebarNav from "./SidebarNav";
export default function DashboardLayout() {
    const { t, locale } = useI18n();
    const sheetSide = useMemo(() => (locale === "fa" ? "right" : "left"), [locale]);
    return (_jsxs("div", { className: "min-h-dvh grid grid-rows-[auto_1fr] bg-background text-foreground", children: [_jsxs("header", { className: "sticky top-0 z-10 border-b bg-background/80 backdrop-blur p-3 flex items-center gap-3", children: [_jsx("div", { className: "lg:hidden", children: _jsxs(Sheet, { children: [_jsx(SheetTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", "aria-label": "Open menu", children: _jsx(Menu, { className: "size-4" }) }) }), _jsxs(SheetContent, { side: sheetSide, className: "w-72 p-0", children: [_jsx("div", { className: "p-4 border-b", children: _jsx(SheetHeader, { children: _jsx(SheetTitle, { children: t("appTitle") }) }) }), _jsx(ScrollArea, { className: "h-[calc(100vh-4rem)] p-4", children: _jsx(SidebarNav, {}) })] })] }) }), _jsx(Link, { to: "/", className: "font-bold hidden lg:inline", children: t("appTitle") }), _jsxs("div", { className: "ms-auto flex items-center gap-2", children: [_jsx(LanguageToggle, {}), _jsx(ThemeToggle, {})] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-0", children: [_jsxs("aside", { className: "hidden lg:flex lg:flex-col border-e", children: [_jsx("div", { className: "p-4 border-b font-bold", children: t("appTitle") }), _jsx(ScrollArea, { className: "flex-1 p-4", children: _jsx(SidebarNav, {}) })] }), _jsx("main", { className: "p-4 md:p-6 min-w-0", children: _jsx(Outlet, {}) })] })] }));
}
