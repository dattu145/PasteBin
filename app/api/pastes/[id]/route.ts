import { NextRequest, NextResponse } from 'next/server'
import { getNow } from '@/lib/utils'
import { getPasteAndIncrement } from '@/lib/pastes'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const testHeader = request.headers.get('x-test-now-ms')
    const now = getNow(testHeader)

    try {
        const result = await getPasteAndIncrement(id, now)

        if (!result) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 })
        }

        return NextResponse.json(result)

    } catch (e) {
        console.error('Error fetching paste:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
