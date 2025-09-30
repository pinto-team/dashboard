import * as React from 'react'
import { JSX } from 'react'
import { Loader2, X } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useI18n } from '@/shared/hooks/useI18n'
import { uploadSingleImage } from '@/shared/api/files'

type UploadedImage = { id?: string | null; url?: string | null }

type Props = Readonly<{
    value?: string | null
    onChange: (file: UploadedImage | null) => void
    label?: string
    disabled?: boolean
    maxSizeMB?: number
    aspect?: 'square' | 'video'
    className?: string
    emptyContent?: React.ReactNode
    altText?: string
}>

export default function ImageUploader({
    value,
    onChange,
    label,
    disabled = false,
    maxSizeMB = 5,
    aspect = 'square',
    className,
    emptyContent,
    altText,
}: Props): JSX.Element {
    const { t } = useI18n()
    const [dragOver, setDragOver] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)
    const [localPreview, setLocalPreview] = React.useState<string | null>(null)

    const inputRef = React.useRef<HTMLInputElement>(null)
    const abortRef = React.useRef<AbortController | null>(null)
    const previewUrlRef = React.useRef<string | null>(null)
    const inputId = React.useId()

    React.useEffect(() => {
        return () => {
            abortRef.current?.abort()
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current)
                previewUrlRef.current = null
            }
        }
    }, [])

    const validateFile = React.useCallback(
        (file: File): boolean => {
            if (!file.type.startsWith('image/')) {
                toast.error(t('uploader.errors.type_image_only'))
                return false
            }
            const maxBytes = maxSizeMB * 1024 * 1024
            if (file.size > maxBytes) {
                toast.error(t('uploader.errors.max_size', { size: maxSizeMB }))
                return false
            }
            return true
        },
        [maxSizeMB, t],
    )

    const startPreviewAndUpload = React.useCallback(
        async (file: File) => {
            if (!validateFile(file) || disabled) return
            if (localPreview) URL.revokeObjectURL(localPreview)

            const objectUrl = URL.createObjectURL(file)
            setLocalPreview(objectUrl)
            previewUrlRef.current = objectUrl

            abortRef.current?.abort()
            abortRef.current = new AbortController()

            try {
                setUploading(true)
                const { id, url } = await uploadSingleImage(file, abortRef.current.signal)
                onChange({ id, url })
                toast.success(t('uploader.success'))
                URL.revokeObjectURL(objectUrl)
                previewUrlRef.current = null
                setLocalPreview(null)
            } catch (err: unknown) {
                if (
                    (err instanceof DOMException && err.name === 'AbortError') ||
                    (axios.isCancel(err) || (err as AxiosError | undefined)?.code === 'ERR_CANCELED')
                ) {
                    return
                }
                toast.error(t('uploader.errors.generic'))
            } finally {
                setUploading(false)
            }
        },
        [disabled, localPreview, onChange, t, validateFile],
    )

    const handleFiles = React.useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return
            void startPreviewAndUpload(files[0])
        },
        [startPreviewAndUpload],
    )

    const onDrop = React.useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            setDragOver(false)
            if (!disabled) void handleFiles(e.dataTransfer.files)
        },
        [disabled, handleFiles],
    )

    const openPicker = React.useCallback(() => {
        if (!disabled) inputRef.current?.click()
    }, [disabled])

    const clearImage = React.useCallback(
        (e?: React.MouseEvent<HTMLButtonElement>) => {
            e?.stopPropagation()
            onChange(null)
            if (localPreview) {
                URL.revokeObjectURL(localPreview)
                previewUrlRef.current = null
                setLocalPreview(null)
            }
        },
        [localPreview, onChange],
    )

    const shownSrc = localPreview || value || undefined
    const aspectClass = aspect === 'square' ? 'aspect-square' : 'aspect-video'
    const emptyState = emptyContent ?? t('uploader.hint.drag_or_click')
    const imageAlt = altText ?? t('uploader.alt.image_preview')

    const dropZoneClassName = cn(
        'relative flex w-full items-center justify-center rounded-xl border border-dashed p-4',
        aspectClass,
        dragOver ? 'bg-muted/50' : 'bg-muted/20',
        disabled ? 'pointer-events-none opacity-60' : 'cursor-pointer',
        className,
    )

    return (
        <div className="grid gap-2">
            {label ? <Label htmlFor={inputId}>{label}</Label> : null}

            <div
                className={dropZoneClassName}
                role="button"
                tabIndex={0}
                aria-label={t('uploader.aria.drop_or_click')}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openPicker()
                    }
                }}
                onClick={openPicker}
                onDrop={onDrop}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
            >
                {shownSrc ? (
                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                        <img
                            src={shownSrc}
                            alt={imageAlt}
                            className="h-full w-full object-contain"
                            loading="lazy"
                            decoding="async"
                        />

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={clearImage}
                        >
                            <X className="h-4 w-4" />
                            {t('uploader.actions.remove')}
                        </Button>

                        {uploading && (
                            <div className="absolute inset-0 grid place-items-center rounded-lg bg-background/60 backdrop-blur">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>{t('uploader.status.uploading')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-sm text-muted-foreground">{emptyState}</div>
                )}
            </div>

            <input
                id={inputId}
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={(e) => void handleFiles(e.currentTarget.files)}
            />
        </div>
    )
}
