import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Simple check - just ensure client is initialized
        // Real connectivity check would require a query, but table might not exist yet
        if (!supabase) {
            throw new Error('Supabase client not initialized')
        }
        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (error) {
        console.error('Health check failed:', error)
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
