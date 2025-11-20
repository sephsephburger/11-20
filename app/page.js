"use client";

import { useState } from 'react';
import { validateInstagramUrl } from '../lib/validateInstagramUrl';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setPost(null);

    const result = validateInstagramUrl(url);
    setStatus(result);
    if (result.type !== 'success') return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const payload = await response.json();

      if (!response.ok) {
        setStatus({
          type: 'error',
          code: payload.code || 'fetch-failed',
          message: payload.error || 'Could not fetch metadata. Try again.'
        });
        return;
      }

      setStatus({
        type: 'success',
        code: 'stored',
        message: 'Fetched metadata and saved the post.'
      });
      setPost(payload.post);
    } catch (error) {
      setStatus({
        type: 'error',
        code: 'network',
        message: 'Network error while fetching metadata.'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const statusTone = {
    success: '#0f9d58',
    error: '#d93025',
    info: '#1a73e8'
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Instagram Post Helper</h1>
        <p style={styles.subtitle}>
          Paste an Instagram post link to validate it before fetching metadata.
        </p>
      </header>

      <section style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="postUrl" style={styles.label}>
            Instagram URL
          </label>
          <div style={styles.inputRow}>
            <input
              id="postUrl"
              name="postUrl"
              type="url"
              placeholder="https://www.instagram.com/p/abc12345/"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              style={styles.input}
              autoComplete="off"
              disabled={isLoading}
            />
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? 'Fetching...' : 'Fetch & Save'}
            </button>
          </div>
          <p style={styles.helper}>
            Accepts public post, reel, or IGTV permalinks. Profile links and private posts are
            rejected.
          </p>
        </form>

        {status && (
          <div
            style={{
              ...styles.statusBox,
              color: statusTone[status.type] || '#1a1a1a',
              borderColor: statusTone[status.type] || '#d0d7de',
              backgroundColor:
                status.type === 'success' ? '#e6f4ea' : status.type === 'error' ? '#fce8e6' : '#eef3fc'
            }}
          >
            <strong style={{ display: 'block', marginBottom: 4 }}>
              {status.type === 'success' ? 'Ready' : 'Issue detected'}
            </strong>
            <span>{status.message}</span>
          </div>
        )}

        {post && (
          <div style={styles.preview}>
            <div style={styles.previewHeader}>
              <div>
                <div style={styles.previewLabel}>Saved post</div>
                <div style={styles.previewTitle}>{post.creator_name || 'Unknown creator'}</div>
              </div>
              <span style={styles.previewSource}>{post.source || 'oembed'}</span>
            </div>
            <div style={styles.previewBody}>
              {post.thumbnail_url ? (
                <img
                  src={post.thumbnail_url}
                  alt={post.caption || 'Instagram post thumbnail'}
                  style={styles.previewImage}
                />
              ) : (
                <div style={styles.previewImagePlaceholder}>No image in metadata</div>
              )}
              <div>
                <div style={styles.previewUrl}>{post.instagram_url}</div>
                <div style={styles.previewCaption}>
                  {post.caption || 'No caption found for this post.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: '#f5f7fb',
    minHeight: '100vh',
    color: '#111827'
  },
  header: {
    maxWidth: '720px',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '2rem',
    margin: 0
  },
  subtitle: {
    marginTop: '0.35rem',
    color: '#4b5563',
    lineHeight: 1.5
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '1.25rem',
    maxWidth: '720px',
    boxShadow: '0 10px 30px rgba(17, 24, 39, 0.08)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  label: {
    fontWeight: 600,
    color: '#111827'
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem'
  },
  input: {
    flex: 1,
    padding: '0.85rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid #d0d7de',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxShadow: '0 1px 2px rgba(17, 24, 39, 0.05)'
  },
  button: {
    padding: '0.85rem 1.1rem',
    borderRadius: '10px',
    border: 'none',
    background: '#111827',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    minWidth: '120px',
    opacity: 1
  },
  helper: {
    margin: 0,
    color: '#6b7280',
    fontSize: '0.95rem'
  },
  statusBox: {
    marginTop: '1rem',
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    border: '1px solid',
    backgroundColor: '#eef3fc',
    fontSize: '0.98rem'
  },
  preview: {
    marginTop: '1.2rem',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1rem',
    background: '#fafbff'
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem'
  },
  previewLabel: {
    fontSize: '0.9rem',
    color: '#6b7280'
  },
  previewTitle: {
    marginTop: '0.15rem',
    fontWeight: 700
  },
  previewSource: {
    background: '#111827',
    color: '#fff',
    borderRadius: '999px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.85rem'
  },
  previewBody: {
    display: 'flex',
    gap: '0.85rem',
    alignItems: 'flex-start'
  },
  previewImage: {
    width: 120,
    height: 120,
    objectFit: 'cover',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    background: '#fff'
  },
  previewImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: '10px',
    border: '1px dashed #d1d5db',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem'
  },
  previewUrl: {
    fontSize: '0.9rem',
    color: '#4b5563',
    wordBreak: 'break-all',
    marginBottom: '0.4rem'
  },
  previewCaption: {
    fontSize: '1rem',
    color: '#111827',
    lineHeight: 1.5
  }
};
