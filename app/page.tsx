'use client'

import React, { useState } from 'react'

export default function CreatePastePage() {
  const [content, setContent] = useState('')
  const [ttl, setTtl] = useState<number | ''>('')
  const [maxViews, setMaxViews] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ id: string, url: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <main className="view-container animate-fade-in">
        <div className="card" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '2rem' }}>Paste Created successfully!</h1>

          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <label className="label">Share this link</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                readOnly
                value={result.url}
                className="input"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                className="btn btn-secondary"
                onClick={() => navigator.clipboard.writeText(result.url)}
                type="button"
              >
                Copy
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <a href={result.url} className="btn btn-primary">View Paste</a>
            <button onClick={() => { setResult(null); setContent(''); setTtl(''); setMaxViews('') }} className="btn btn-secondary">Create Another</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="view-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-0.05em', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          Pastebin Lite
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Share text securely with expiration and view limits.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="label">Content</label>
            <textarea
              suppressHydrationWarning
              className="textarea"
              rows={12}
              placeholder="Paste your code or text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ resize: 'vertical', fontFamily: 'monospace' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label className="label">Expiration (Seconds)</label>
              <input
                suppressHydrationWarning
                type="number"
                className="input"
                placeholder="e.g. 3600 (1 hour)"
                min="1"
                value={ttl}
                onChange={(e) => setTtl(e.target.value ? Number(e.target.value) : '')}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Optional. Leave empty for unlimited time.
              </small>
            </div>
            <div>
              <label className="label">Max Views</label>
              <input
                suppressHydrationWarning
                type="number"
                className="input"
                placeholder="e.g. 5"
                min="1"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : '')}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Optional. Leave empty for unlimited views.
              </small>
            </div>
          </div>

          {error && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <button suppressHydrationWarning type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </form>
      </div>
    </main>
  )
}
