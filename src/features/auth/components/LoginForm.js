import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
const schema = z.object({
    email: z.string().min(1, "Required").email("Invalid email"),
    password: z.string().min(6, "At least 6 chars"),
});
export default function LoginForm({ onSubmit, loading, }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
        mode: "onTouched",
    });
    return (_jsxs("form", { className: "grid gap-4", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", dir: "ltr", inputMode: "email", className: "font-mono text-sm", placeholder: "name@example.com", ...register("email") }), errors.email && _jsx("p", { className: "text-xs text-destructive", children: errors.email.message })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", dir: "ltr", className: "text-sm", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register("password") }), errors.password && _jsx("p", { className: "text-xs text-destructive", children: errors.password.message })] }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full", children: loading ? "Loading..." : "Sign in" })] }));
}
