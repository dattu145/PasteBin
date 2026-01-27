import { supabase } from './supabase'

export type PasteResult = {
    content: string
    remaining_views: number | null
    expires_at: Date | null
}

export async function getPasteAndIncrement(id: string, now: Date): Promise<PasteResult | null> {
    const { data: paste, error } = await supabase
        .from('pastes')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !paste) return null

    const expiresAt = paste.expires_at ? new Date(paste.expires_at) : null

    if (expiresAt && now > expiresAt) return null

    if (paste.max_views !== null && paste.current_views >= paste.max_views) return null

    await supabase.rpc('increment_view_count', { row_id: id })

    return {
        content: paste.content,
        remaining_views: paste.max_views ? Math.max(0, paste.max_views - (paste.current_views + 1)) : null,
        expires_at: expiresAt
    }
}
