import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useI18n } from "@/shared/hooks/useI18n";
export default function SidebarNav() {
    const { pathname } = useLocation();
    const { t } = useI18n();
    const Item = ({ to, children, }) => {
        const active = (to === "/" && pathname === "/") ||
            (to !== "/" && pathname.startsWith(to));
        return (_jsx(Button, { asChild: true, variant: active ? "secondary" : "ghost", className: "justify-start", children: _jsx(Link, { to: to, children: children }) }));
    };
    return (_jsxs("nav", { className: "grid gap-1", children: [_jsx(Item, { to: "/", children: t("nav.dashboard") }), _jsx(Item, { to: "/login", children: t("nav.login") })] }));
}
