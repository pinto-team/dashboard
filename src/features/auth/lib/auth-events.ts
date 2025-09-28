// features/auth/lib/auth-events.ts
import { defaultLogger } from '@/shared/lib/logger'

export type AuthEventMap = {
    logout: { reason?: string; redirect?: boolean } | undefined
    tokenRefreshed: { accessToken: string; refreshToken: string }
}

type Listener<K extends keyof AuthEventMap> = (payload: AuthEventMap[K]) => void

type ListenerRegistry = {
    [K in keyof AuthEventMap]: Set<Listener<K>>
}

const listeners: ListenerRegistry = {
    logout: new Set(),
    tokenRefreshed: new Set(),
}

function onAuthEvent<K extends keyof AuthEventMap>(event: K, listener: Listener<K>): () => void {
    const registry = listeners[event] as Set<Listener<K>>
    registry.add(listener)
    return () => {
        registry.delete(listener)
    }
}

function emitAuthEvent<K extends keyof AuthEventMap>(event: K, payload: AuthEventMap[K]): void {
    const registry = listeners[event] as Set<Listener<K>>
    registry.forEach((listener) => {
        try {
            listener(payload)
        } catch (error) {
            defaultLogger.error('Auth event listener failed', { event, error })
        }
    })
}

export function onForcedLogout(listener: Listener<'logout'>): () => void {
    return onAuthEvent('logout', listener)
}

export function onTokenRefreshed(listener: Listener<'tokenRefreshed'>): () => void {
    return onAuthEvent('tokenRefreshed', listener)
}

export function emitForcedLogout(payload: AuthEventMap['logout'] = undefined): void {
    emitAuthEvent('logout', payload)
}

export function emitTokenRefreshed(payload: AuthEventMap['tokenRefreshed']): void {
    emitAuthEvent('tokenRefreshed', payload)
}
