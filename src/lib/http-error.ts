// lib/http-error.ts
import axios from 'axios'

export class HttpError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message)
        this.name = 'HttpError'
    }
}

export function toHttpError(err: unknown, fallbackMsg: string): HttpError {
    if (axios.isAxiosError<{ message?: string }>(err)) {
        return new HttpError(
            err.response?.status ?? 500,
            err.response?.data?.message ?? fallbackMsg,
        )
    }
    return new HttpError(500, fallbackMsg)
}
