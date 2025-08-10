import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import AppRoot from "@/app/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";
export const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(AppRoot, {}),
        children: [
            { path: "login", element: _jsx(LoginPage, {}) },
            {
                element: _jsx(ProtectedRoute, {}),
                children: [
                    { index: true, element: _jsx(DashboardPage, {}) },
                    { path: "*", element: _jsx(NotFound, {}) }, // ⬅️ 404
                ],
            },
        ],
    },
]);
