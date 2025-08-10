import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils.ts";

export function H1({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <h1 className={cn("scroll-m-20 text-3xl md:text-4xl font-extrabold tracking-tight", className)}>{children}</h1>;
}
export function H2({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <h2 className={cn("scroll-m-20 text-2xl md:text-3xl font-bold tracking-tight", className)}>{children}</h2>;
}
export function H3({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <h3 className={cn("scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight", className)}>{children}</h3>;
}
export function Lead({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <p className={cn("text-sm md:text-base text-muted-foreground", className)}>{children}</p>;
}
export function Muted({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <p className={cn("text-xs text-muted-foreground", className)}>{children}</p>;
}
export function Small({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <small className={cn("text-xs font-medium leading-none", className)}>{children}</small>;
}
