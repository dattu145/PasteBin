import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateId, getNow } from '@/lib/utils'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { content, ttl_seconds, max_views } = body

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 })
        }

        const testHeader = request.headers.get('x-test-now-ms')
        const now = getNow(testHeader)

        let expiresAt: string | null = null
        if (ttl_seconds) {
            expiresAt = new Date(now.getTime() + ttl_seconds * 1000).toISOString()
        }

        const id = generateId()

        const { data, error } = await supabase
            .from('pastes')
            .insert([
                {
                    id,
                    content,
                    expires_at: expiresAt,
                    max_views: max_views,
                    current_views: 0
                }
            ])
            .select()

        if (error) {
            console.error('Supabase error:', error)
            throw new Error(error.message)
        }

        const origin = request.nextUrl.origin
        const url = `${origin}/p/${id}`

        return NextResponse.json({ id, url }, { status: 200 })

    } catch (e: any) {
        console.error('Error creating paste:', e)
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 })
    }
}
