import { CheckCircle2, Info, XCircle } from 'lucide-react'

import * as React from 'react'
import { JSX } from 'react'

import { Button } from '@/components/ui/button'

type Action = Readonly<{
    label: string
    onClick: () => void
}>

type Props = Readonly<{
    open: boolean
    onOpenChange: (open: boolean) => void
    variant?: 'success' | 'error' | 'info'
    title: string
    description?: string
    actions?: Action[]
}>

/**
 * Lightweight modal dialog (no external dependencies)
 * - Token-based colors
 * - Centered card with overlay
 */
export default function ResultDialog({
    open,
    onOpenChange,
    variant = 'info',
    title,
    description,
    actions = [],
}: Props): JSX.Element | null {
    if (!open) return null

    const Icon = variant === 'success' ? CheckCircle2 : variant === 'error' ? XCircle : Info
    const iconClass =
        variant === 'success'
            ? 'text-green-600 dark:text-green-500'
            : variant === 'error'
              ? 'text-red-600 dark:text-red-500'
              : 'text-primary'

    return (
        <div
            className="fixed inset-0 z-[60] grid place-items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-dialog-title"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/35 dark:bg-black/50"
                onClick={() => onOpenChange(false)}
            />
            {/* Panel */}
            <div className="relative z-[61] w-[min(560px,92vw)] rounded-xl border bg-background p-5 shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${iconClass}`} />
                    <h2 id="result-dialog-title" className="text-base font-semibold">
                        {title}
                    </h2>
                </div>
                {description && <p className="mb-5 text-sm text-muted-foreground">{description}</p>}
                <div className="flex justify-end gap-2">
                    {actions.map((a, idx) => (
                        <Button key={idx} onClick={a.onClick}>
                            {a.label}
                        </Button>
                    ))}
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        common.close
                    </Button>
                </div>
            </div>
        </div>
    )
}
