import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const loc = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
    }
    return <Outlet />;
}
