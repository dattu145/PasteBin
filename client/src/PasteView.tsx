import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_Base = 'http://localhost:3002/api';

type PasteData = {
    content: string;
    remaining_views: number | null;
    expires_at: string | null;
    error?: string;
};



export function PasteView() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<PasteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!id || hasFetched.current) return;

        hasFetched.current = true;

        fetch(`${API_Base}/pastes/${id}`)
            .then(async (res) => {
                const json = await res.json();
                if (!res.ok) {
                    throw new Error(json.error || 'Failed to fetch paste');
                }
                setData(json);
            })
            .catch((err) => {
                setError(err.message);
                // Reset fetched status if error, to allow retry if component re-mounts or ID changes
                // But in StrictMode dev this might still loop if we aren't careful.
                // For a simple 'burn on read', explicit error state is final.
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);



    if (loading || !data) {
        if (error) {
            return (
                <div className="not-found-container">
                    <div className="not-found-content">
                        <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 500, background: 'none', WebkitTextFillColor: 'white' }}>404</h1>
                        <div className="divider"></div>
                        <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>This page could not be found.</p>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="view-container">
            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', background: 'none', WebkitTextFillColor: 'white', fontSize: '2rem' }}>Shared Paste</h1>

            <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {data.expires_at && (
                    <span className="badge">
                        Expires: {new Date(data.expires_at).toLocaleString()}
                    </span>
                )}
                {data.remaining_views !== null && (
                    <span className="badge">
                        Remaining Views: {data.remaining_views}
                    </span>
                )}
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
                <div className="content">
                    <pre>{data.content}</pre>
                </div>
            </div>

            <div style={{ textAlign: 'center' }}>
                <Link to="/" className="btn-secondary">
                    Create New Paste
                </Link>
            </div>
        </div>
    );
}
