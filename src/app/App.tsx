import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/core/layouts/DashboardLayout";

export default function AppRoot() {
    const { pathname } = useLocation();

    if (pathname.startsWith("/login")) {
        return <Outlet />;
    }

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}
