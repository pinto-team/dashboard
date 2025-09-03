// src/features/brands/components/BrandLogoUploader.tsx
/**
 * BrandLogoUploader
 * -----------------
 * - Instant local preview + auto-upload in background
 * - Aspect control: 'square' | 'video' (default: 'video')
 * - Size control via className (e.g., max-h-64)
 * - No hardcoded colors (token-based utilities only)
 */
import { Loader2, X } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

import * as React from 'react'
import { JSX } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/shared/hooks/useI18n'
import { uploadSingleImage } from '@/shared/api/files'

type Props = Readonly<{
    /** Current preview URL */
    value?: string | null
    /** Called with uploaded file info; pass null to clear */
    onChange: (file: { id?: string | null; url?: string | null } | null) => void
    label?: string
    disabled?: boolean
    maxSizeMB?: number
    /** Aspect ratio of preview box */
    aspect?: 'square' | 'video'
    /** Extra classes for the dropzone container (e.g., max-h-64) */
    className?: string
}>

export default function BrandLogoUploader({
    value,
    onChange,
    label,
    disabled = false,
    maxSizeMB = 5,
    aspect = 'square',
    className,
}: Props): JSX.Element {
    const { t } = useI18n()
    const [dragOver, setDragOver] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)
    const [localPreview, setLocalPreview] = React.useState<string | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const abortRef = React.useRef<AbortController | null>(null)
    const previewUrlRef = React.useRef<string | null>(null)

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
                toast.error(t('uploader.errors.type_image_only') || 'Only image files are allowed')
                return false
            }
            const maxBytes = maxSizeMB * 1024 * 1024
            if (file.size > maxBytes) {
                toast.error(
                    t('uploader.errors.max_size', { size: maxSizeMB }) ||
                        `Max file size is ${maxSizeMB}MB`,
                )
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
                toast.success(t('uploader.success') || 'Upload completed')
                URL.revokeObjectURL(objectUrl)
                previewUrlRef.current = null
                setLocalPreview(null)
            } catch (err: unknown) {
                if (
                    (err instanceof DOMException && err.name === 'AbortError') ||
                    (axios.isCancel(err) || (err as AxiosError | undefined)?.code === 'ERR_CANCELED')
                )
                    return
                const msg =
                    err instanceof Error ? err.message : (t('uploader.errors.generic') as string)
                toast.error(msg)
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
            if (disabled) return
            void handleFiles(e.dataTransfer.files)
        },
        [disabled, handleFiles],
    )

    const onDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(true)
    }, [])

    const onDragLeave = React.useCallback(() => setDragOver(false), [])

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

    const dropZoneClassName = [
        'relative flex w-full items-center justify-center rounded-xl border border-dashed p-4',
        aspectClass,
        dragOver ? 'bg-muted/50' : 'bg-muted/20',
        disabled ? 'opacity-60 pointer-events-none' : 'cursor-pointer',
        className ?? '',
    ].join(' ')

    return (
        <div className="grid gap-2">
            <Label>{label ?? (t('brands.form.logo') as string)}</Label>

            <div
                className={dropZoneClassName}
                role="button"
                tabIndex={0}
                aria-label={t('uploader.aria.drop_or_click') as string}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openPicker()
                    }
                }}
                onClick={openPicker}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
            >
                {shownSrc ? (
                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                        <img
                            src={shownSrc}
                            alt={t('brands.logo_alt') as string}
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
                                    <span>{t('uploader.status.uploading') as string}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-sm text-muted-foreground">
                        {t('uploader.hint.drag_or_click') as string}
                    </div>
                )}
            </div>

            <input
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
