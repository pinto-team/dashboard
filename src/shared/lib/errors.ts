// shared/lib/errors.ts
import { defaultLogger } from './logger'

// Base application error class
export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean
    public readonly code: string

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'INTERNAL_ERROR',
        isOperational: boolean = true,
    ) {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.isOperational = isOperational

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError)
        }

        // Log the error
        defaultLogger.error(message, {
            statusCode,
            code,
            stack: this.stack,
            isOperational,
        })
    }
}

// Specific error classes
export class ValidationError extends AppError {
    public readonly details?: Record<string, unknown>

    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 400, 'VALIDATION_ERROR')
        this.details = details
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR')
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, 403, 'AUTHORIZATION_ERROR')
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND_ERROR')
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource conflict') {
        super(message, 409, 'CONFLICT_ERROR')
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Rate limit exceeded') {
        super(message, 429, 'RATE_LIMIT_ERROR')
    }
}

// Standardized API response types
export type { ApiResponse } from '../api/types'

export interface ApiErrorResponse {
    success: false
    message: string
    code: string
    errors?: Record<string, string[]>
    timestamp: string
}

export interface ApiSuccessResponse<T> {
    success: true
    data: T
    message?: string
    timestamp: string
}

// Response helper functions
export function createSuccessResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    }
}

export function createErrorResponse(
    error: AppError | Error | string,
    errors?: Record<string, string[]>,
): ApiErrorResponse {
    const message = error instanceof Error ? error.message : error
    const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR'

    return {
        success: false,
        message,
        code,
        errors,
        timestamp: new Date().toISOString(),
    }
}

// Error handler for async operations
export function handleAsyncError<T>(
    promise: Promise<T>,
    errorMessage: string = 'Operation failed',
): Promise<T> {
    return promise.catch((error) => {
        if (error instanceof AppError) {
            throw error
        }
        // Ignore cancellation errors
        if (
            error?.code === 'ERR_CANCELED' ||
            error?.name === 'CanceledError' ||
            error?.message === 'canceled'
        ) {
            throw error
        }

        defaultLogger.error(errorMessage, {
            originalError: error,
            stack: error.stack,
        })

        throw new AppError(errorMessage, 500, 'INTERNAL_ERROR')
    })
}
