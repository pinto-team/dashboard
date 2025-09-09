import type { AxiosRequestConfig } from 'axios'
import { catalogClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import { API_CONFIG } from '@/shared/config/api.config'
import type { UploadFilesResponse } from '@/features/brands/model/types'

export function toAbsoluteUrl(pathOrUrl: string): string {
    if (!pathOrUrl) return ''
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
    const base = API_CONFIG.CATALOG.BASE_URL || API_CONFIG.BASE_URL
    return `${base}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

export async function uploadSingleImage(
    file: File,
    signal?: AbortSignal,
): Promise<{ id: string; url: string }> {
    const form = new FormData()
    // Backend accepts `files` as an array; single file upload still uses the same field
    form.append('files', file)

    const cfg: AxiosRequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal,
    }

    const { data } = await catalogClient.post<UploadFilesResponse>(
        API_ROUTES.FILES.UPLOAD,
        form,
        cfg,
    )

    const first = data.files?.[0]
    if (!first || !first.url || !first.id) {
        throw new Error('Upload failed: empty response')
    }
    return { id: first.id, url: toAbsoluteUrl(first.url) }
}

export async function uploadFiles(files: File[], signal?: AbortSignal): Promise<string[]> {
    if (!files || files.length === 0) return []
    const form = new FormData()
    files.forEach((f) => form.append('files', f))

    const cfg: AxiosRequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal,
    }

    const { data } = await catalogClient.post<UploadFilesResponse>(
        API_ROUTES.FILES.UPLOAD,
        form,
        cfg,
    )
    return (data.files || []).map((f: { url: string }) => toAbsoluteUrl(f.url))
}

