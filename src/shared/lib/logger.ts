// shared/lib/logger.ts

// Logger interface for type safety
export interface LoggerContext {
    requestId?: string
    userId?: string
    component?: string
    action?: string
    [key: string]: unknown
}

// Enhanced logger with context support for frontend
export class Logger {
    private context: LoggerContext
    private isDevelopment: boolean

    constructor(context: LoggerContext = {}) {
        this.context = context
        this.isDevelopment = import.meta.env.DEV
    }

    private formatMessage(level: string, message: string, meta?: Record<string, unknown>): string {
        const timestamp = new Date().toISOString()
        const contextStr =
            Object.keys(this.context).length > 0
                ? ` [${Object.entries(this.context)
                      .map(([k, v]) => `${k}:${v}`)
                      .join(', ')}]`
                : ''
        const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : ''

        return `[${timestamp}] ${level.toUpperCase()}:${contextStr} ${message}${metaStr}`
    }

    private log(level: string, message: string, meta?: Record<string, unknown>) {
        const formattedMessage = this.formatMessage(level, message, meta)

        if (this.isDevelopment) {
            // In development, use console with colors and grouping
            const groupName = `${this.context.component || 'App'} - ${this.context.action || 'Action'}`

            console.group(`%c${groupName}`, 'color: #3b82f6; font-weight: bold;')
            console.log(`%c${formattedMessage}`, this.getLevelColor(level))
            if (meta && Object.keys(meta).length > 0) {
                console.table(meta)
            }
            console.groupEnd()
        } else {
            // In production, just log the message
            console.log(formattedMessage)
        }
    }

    private getLevelColor(level: string): string {
        switch (level) {
            case 'error':
                return 'color: #ef4444; font-weight: bold;'
            case 'warn':
                return 'color: #f59e0b; font-weight: bold;'
            case 'info':
                return 'color: #3b82f6; font-weight: bold;'
            case 'debug':
                return 'color: #10b981; font-weight: bold;'
            default:
                return 'color: #6b7280;'
        }
    }

    info(message: string, meta?: Record<string, unknown>) {
        this.log('info', message, meta)
    }

    warn(message: string, meta?: Record<string, unknown>) {
        this.log('warn', message, meta)
    }

    error(message: string, meta?: Record<string, unknown>) {
        this.log('error', message, meta)
    }

    debug(message: string, meta?: Record<string, unknown>) {
        if (this.isDevelopment) {
            this.log('debug', message, meta)
        }
    }

    // Method to add context
    withContext(context: LoggerContext): Logger {
        return new Logger({ ...this.context, ...context })
    }
}

// Default logger instance
export const defaultLogger = new Logger()

// Console logger for direct use if needed
export const consoleLogger = {
    info: (message: string, ...args: unknown[]) => console.info(message, ...args),
    warn: (message: string, ...args: unknown[]) => console.warn(message, ...args),
    error: (message: string, ...args: unknown[]) => console.error(message, ...args),
    debug: (message: string, ...args: unknown[]) => console.debug(message, ...args),
    log: (message: string, ...args: unknown[]) => console.log(message, ...args),
}
