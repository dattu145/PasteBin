import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getPasteAndIncrement } from '@/lib/pastes'
import { getNow } from '@/lib/utils'

export default async function ViewPastePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const headersList = await headers()
    const testHeader = headersList.get('x-test-now-ms')
    const now = getNow(testHeader)

    const result = await getPasteAndIncrement(id, now)

    if (!result) {
        notFound()
    }

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Shared Paste</h1>
                <div className="meta-info">
                    {result.expires_at && (
                        <span className="badge">Expires: {new Date(result.expires_at).toLocaleString()}</span>
                    )}
                    {result.remaining_views !== null && (
                        <span className="badge">Remaining Views: {result.remaining_views}</span>
                    )}
                </div>
            </header>
            <div className="paste-content">
                <pre>{result.content}</pre>
            </div>
            <footer className="view-footer">
                <a href="/" className="btn-secondary">Create New Paste</a>
            </footer>
        </div>
    )
}
