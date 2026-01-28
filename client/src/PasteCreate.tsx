import { useState } from 'react';

const API_Base = import.meta.env.VITE_API_BASE_URL || '/api';

export function PasteCreate() {
    const [content, setContent] = useState('');
    const [ttl, setTtl] = useState<number | ''>('');
    const [maxViews, setMaxViews] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_Base}/pastes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    ttl_seconds: ttl ? Number(ttl) : undefined,
                    max_views: maxViews ? Number(maxViews) : undefined
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // data.url might be full URL from backend, but front-end routing is client-side.
            // Backend returns "http://localhost:3002/p/ID".
            // We want to show the FRONTEND url.
            // We can construct it from current location or use the ID.
            const currentOrigin = window.location.origin;
            setResultUrl(`${currentOrigin}/p/${data.id}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setResultUrl(null);
        setContent('');
        setTtl('');
        setMaxViews('');
    };

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!resultUrl) return;
        navigator.clipboard.writeText(resultUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (resultUrl) {
        return (
            <div className="view-container">
                <div className="card">
                    <h2 style={{ marginBottom: '2rem', marginTop: 0, textAlign: 'center' }}>Paste Created successfully!</h2>

                    <label className="label" style={{ color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Share this link</label>
                    <div className="input-group">
                        <input
                            readOnly
                            value={resultUrl}
                            className="input-read-only"
                        />
                        <button
                            onClick={handleCopy}
                            className="copy-btn"
                            style={{ minWidth: '80px' }}
                        >
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    <div className="btn-group">
                        <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-sm">
                            View Paste
                        </a>
                        <button onClick={reset} className="btn-secondary">
                            Create Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <h1>Pastebin Lite</h1>
            <p className="subtitle">Share text securely with expiration and view limits.</p>

            <div className="card">
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Content</label>
                        <textarea
                            className="textarea"
                            rows={12}
                            placeholder="Paste your code or text here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid-2">
                        <div>
                            <label className="label">Expiration (Seconds)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="e.g. 3600 (1 hour)"
                                min="1"
                                value={ttl}
                                onChange={(e) => setTtl(e.target.value ? Number(e.target.value) : '')}
                            />
                            <small className="hint">
                                Optional. Leave empty for unlimited time.
                            </small>
                        </div>
                        <div>
                            <label className="label">Max Views</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="e.g. 5"
                                min="1"
                                value={maxViews}
                                onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : '')}
                            />
                            <small className="hint">
                                Optional. Leave empty for unlimited views.
                            </small>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Paste'}
                    </button>
                </form>
            </div>
        </div>
    );
}
