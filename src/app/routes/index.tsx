import { createBrowserRouter } from "react-router-dom";
import AppRoot from "@/app/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";
import { ROUTES } from "@/app/routes/routes";
import BlankPage from "@/features/blank/pages/BlankPage";

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <AppRoot />,
        children: [
            // پیش‌فرض: صفحه خالی
            { index: true, element: <BlankPage /> },

            // مسیر مستقیم به صفحه خالی (اختیاری، برای بوکمارک کردن)
            { path: ROUTES.BLANK, element: <BlankPage /> },

            // لاگین مثل قبل
            { path: ROUTES.LOGIN, element: <LoginPage /> },

            // داشبورد فقط برای کاربر لاگین‌شده
            {
                element: <ProtectedRoute />,
                children: [{ path: ROUTES.DASHBOARD, element: <DashboardPage /> }],
            },

            { path: ROUTES.NOT_FOUND, element: <NotFound /> },
        ],
    },
]);
