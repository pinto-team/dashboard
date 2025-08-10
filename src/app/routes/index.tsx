import { createBrowserRouter } from "react-router-dom";
import AppRoot from "@/app/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppRoot />,
        children: [
            { path: "login", element: <LoginPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: "*", element: <NotFound /> }, // ⬅️ 404
                ],
            },
        ],
    },
]);

