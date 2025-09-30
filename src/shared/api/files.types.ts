import type { ApiResponse } from '@/shared/api/types'

export interface UploadedFile {
    id: string
    filename: string
    content_type: string
    size: number
    url: string
    issued_at: string
}

export type UploadFilesResponse = ApiResponse<UploadedFile[]>
