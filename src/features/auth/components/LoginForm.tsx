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

type FormValues = z.infer<typeof schema>;

export default function LoginForm({
                                      onSubmit,
                                      loading,
                                  }: {
    onSubmit: (data: FormValues) => void;
    loading?: boolean;
}) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
        mode: "onTouched",
    });

    return (
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" dir="ltr" inputMode="email" className="font-mono text-sm" placeholder="name@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" dir="ltr" className="text-sm" placeholder="••••••••" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Loading..." : "Sign in"}
            </Button>
        </form>
    );
}
