import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

export function generateId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export function getNow(testNowHeader?: string | null): Date {
    if (process.env.TEST_MODE === '1' && testNowHeader) {
        const ms = parseInt(testNowHeader, 10)
        if (!isNaN(ms)) {
            return new Date(ms)
        }
    }
    return new Date()
}
