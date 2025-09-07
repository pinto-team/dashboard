import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'

type Props = {
    initialName?: string
    placeholder?: string
    loading?: boolean
    onConfirm: (name: string) => void
    onCancel?: () => void
}

export default function InlineEditor({
                                         initialName = '',
                                         placeholder = 'نام دسته…',
                                         loading,
                                         onConfirm,
                                         onCancel,
                                     }: Props) {
    const [name, setName] = useState(initialName)

    return (
        <div className="flex items-center gap-2 w-full" dir="rtl">
            <Input
                autoFocus
                placeholder={placeholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onConfirm(name.trim())
                    if (e.key === 'Escape') onCancel?.()
                }}
                className="max-w-sm"
                disabled={loading}
            />
            <Button
                size="icon"
                className="h-9 w-9"
                onClick={() => onConfirm(name.trim())}
                disabled={loading || name.trim().length === 0}
                aria-label="تأیید"
            >
                <Check className="w-4 h-4" />
            </Button>
        </div>
    )
}
