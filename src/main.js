import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/routes";
import ThemeProvider from "@/app/providers/ThemeProvider";
import I18nProvider from "@/app/providers/I18nProvider";
import AuthProvider from "@/app/providers/AuthProvider";
// ...
import QueryProvider from "@/app/providers/QueryProvider";
// ...
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(ThemeProvider, { children: _jsx(I18nProvider, { children: _jsx(AuthProvider, { children: _jsx(QueryProvider, { children: _jsx(RouterProvider, { router: router }) }) }) }) }) }));
