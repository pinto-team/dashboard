import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/core/layouts/DashboardLayout";
import { ROUTES } from "@/app/routes/routes";

export default function AppRoot() {
    const { pathname } = useLocation();

    if (
        pathname === ROUTES.ROOT || // یعنی "/"
        pathname.startsWith(ROUTES.LOGIN) ||
        pathname.startsWith(ROUTES.BLANK)
    ) {
        return <Outlet />;
    }

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}
