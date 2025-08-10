import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { H1, Lead } from "@/shared/components/typography";
import { cn } from "@/lib/utils";
export default function PageHeader({ title, subtitle, className, actions, }) {
    return (_jsxs("div", { className: cn("surface p-5 md:p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between", className), children: [_jsxs("div", { children: [_jsx(H1, { className: "mb-1", children: title }), subtitle ? _jsx(Lead, { children: subtitle }) : null] }), actions ? _jsx("div", { className: "flex flex-wrap gap-2", children: actions }) : null] }));
}
