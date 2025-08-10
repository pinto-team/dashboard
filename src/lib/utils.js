// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// cn نهایی: ترکیب clsx + tailwind-merge
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
