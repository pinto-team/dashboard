import { createBrowserRouter } from "react-router-dom";
import AppRoot from "@/app/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";
import {ROUTES} from "@/app/routes/routes.ts";

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <AppRoot />,
        children: [
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { element: <ProtectedRoute />, children: [{ index: true, element: <DashboardPage /> }] },
            { path: ROUTES.NOT_FOUND, element: <NotFound /> },
        ]
    },
]);

