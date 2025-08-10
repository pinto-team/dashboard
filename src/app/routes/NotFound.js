import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export default function NotFound() {
    return (_jsx("div", { className: "min-h-dvh grid place-items-center p-6 text-center", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "404" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Page not found." }), _jsx(Link, { to: "/", className: "inline-block rounded-md border px-3 py-2 hover:bg-muted/50", children: "Go Home" })] }) }));
}
