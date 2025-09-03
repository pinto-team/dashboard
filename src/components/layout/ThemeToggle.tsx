import { Moon, Sun } from 'lucide-react'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button.tsx'

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (saved) return saved
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
    )
}
