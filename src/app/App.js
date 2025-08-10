import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/core/layouts/DashboardLayout";
export default function AppRoot() {
    const { pathname } = useLocation();
    if (pathname.startsWith("/login")) {
        return _jsx(Outlet, {});
    }
    return (_jsx(DashboardLayout, { children: _jsx(Outlet, {}) }));
}
