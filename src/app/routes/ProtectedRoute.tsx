import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/useAuth";
import { ROUTES } from "@/app/routes/routes";

export default function ProtectedRoute() {
    const { isAuthenticated, ready } = useAuth();
    const loc = useLocation();

    if (!ready) return null; // یا یک لودر کوچک

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: loc }} />;
    }
    return <Outlet />;
}
