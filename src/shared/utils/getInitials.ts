// src/shared/utils/getInitials.ts
export function getInitials(name: string, maxLetters = 2): string {
    if (!name || typeof name !== "string") return "??"

    const clean = name.trim().replace(/\s+/g, " ")
    if (!clean) return "??"

    // کلمات نام
    const parts = clean.split(" ").filter(Boolean)

    // کمک‌کننده: گرفتن اولین گرافیم/کاراکتر یونیکد از هر بخش
    const firstGrapheme = (s: string) => (Array.from(s)[0] ?? "")

    // اگر حداقل دو کلمه داریم: از دو کلمهٔ اول حرف اول رو بردار
    if (parts.length >= 2) {
        const initials = parts.slice(0, maxLetters).map(firstGrapheme).join("")
        return initials || "??"
    }

    // اگر یک کلمه: دو گرافیم/حرف اول همون کلمه
    const only = parts[0]
    const graphemes = Array.from(only).slice(0, maxLetters).join("")
    return graphemes || "??"
}
