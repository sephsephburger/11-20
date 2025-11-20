"use client";

import { useEffect, useState } from 'react';
import { validateInstagramUrl } from '../lib/validateInstagramUrl';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [linkDrafts, setLinkDrafts] = useState({});
  const [savingLinkId, setSavingLinkId] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setIsLoadingList(true);
    try {
      const response = await fetch('/api/posts');
      const payload = await response.json();
      setPosts(payload.posts || []);
    } catch (error) {
      setStatus({
        type: 'error',
        code: 'load-failed',
        message: 'Could not load saved posts.'
      });
    } finally {
      setIsLoadingList(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

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
      setPosts((prev) => [payload.post, ...prev]);
      setUrl('');
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

  async function handleCopyKeyword(keyword) {
    if (!keyword) return;
    try {
      await navigator.clipboard.writeText(keyword);
      setStatus({
        type: 'success',
        code: 'copied',
        message: 'Keyword copied to clipboard.'
      });
    } catch {
      setStatus({
        type: 'error',
        code: 'copy-failed',
        message: 'Unable to copy keyword.'
      });
    }
  }

  function handleLinkDraftChange(id, value) {
    setLinkDrafts((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSaveLink(postId) {
    const link = (linkDrafts[postId] || '').trim();
    if (!link) {
      setStatus({
        type: 'error',
        code: 'missing-link',
        message: 'Paste a resource link before saving.'
      });
      return;
    }

    setSavingLinkId(postId);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_link: link, status: 'received' })
      });

      const payload = await response.json();
      if (!response.ok) {
        setStatus({
          type: 'error',
          code: payload.code || 'update-failed',
          message: payload.error || 'Could not save resource link.'
        });
        return;
      }

      setStatus({
        type: 'success',
        code: 'link-saved',
        message: 'Resource link saved.'
      });

      setPosts((prev) => prev.map((p) => (p.id === postId ? payload.post : p)));
      setLinkDrafts((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      setStatus({
        type: 'error',
        code: 'network',
        message: 'Network error while saving link.'
      });
    } finally {
      setSavingLinkId(null);
    }
  }

  const statusTone = {
    success: '#0f9d58',
    error: '#d93025',
    info: '#1a73e8',
    requested: '#1a73e8',
    'not requested': '#6b7280',
    received: '#16a34a'
  };

  const theme = {
    pageBg: 'linear-gradient(180deg, #eef2ff 0%, #f8fafc 60%, #ffffff 100%)',
    cardBg: '#ffffff',
    cardBorder: '#e5e7eb',
    primary: '#111827',
    accent: '#4f46e5'
  };

  return (
    <main style={{ ...styles.page, backgroundImage: theme.pageBg }}>
      <header style={styles.header}>
        <h1 style={styles.title}>Instagram Post Helper</h1>
        <p style={styles.subtitle}>
          Paste an Instagram post link to validate it before fetching metadata.
        </p>
      </header>

      <section style={{ ...styles.card, background: theme.cardBg, borderColor: theme.cardBorder }}>
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
            <button type="submit" style={{ ...styles.button, background: theme.accent }} disabled={isLoading}>
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
            <strong style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={styles.statusDot(statusTone[status.type] || '#1a73e8')}>●</span>
              {status.type === 'success' ? 'Ready' : 'Notice'}
            </strong>
            <span>{status.message}</span>
          </div>
        )}
      </section>

      <section style={styles.listSection}>
        <div style={styles.listHeader}>
          <div>
            <h2 style={styles.listTitle}>Saved posts</h2>
            <p style={styles.listSubtitle}>Metadata, tags, and comment keywords are extracted automatically.</p>
          </div>
          <span style={styles.countBadge}>{posts.length}</span>
        </div>

        {isLoadingList ? (
          <div style={styles.emptyBox}>Loading posts…</div>
        ) : posts.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Nothing saved yet</div>
            <div>Add a public Instagram post above to see it listed here.</div>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {posts.map((post) => (
              <article key={post.id} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <div style={styles.creatorRow}>
                    <span style={styles.creatorName}>{post.creator_name || 'Unknown creator'}</span>
                    {post.source && <span style={styles.sourcePill}>{post.source}</span>}
                  </div>
                  <span style={{ ...styles.statusPill, background: statusTone[post.status] || '#e5e7eb', color: '#fff' }}>
                    {post.status}
                  </span>
                </div>

                <div style={styles.postBody}>
                  {post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url}
                      alt={post.caption || 'Instagram post thumbnail'}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <div style={styles.thumbnailPlaceholder}>No image</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={styles.urlText}>{post.instagram_url}</div>
                    <div style={styles.captionText}>{post.caption || 'No caption found.'}</div>
                  </div>
                </div>

                <div style={styles.tagRow}>
                  {post.tags && post.tags.length > 0 ? (
                    post.tags.map((tag) => (
                      <span key={tag} style={styles.tagPill}>
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span style={styles.tagMuted}>No tags detected</span>
                  )}
                </div>

                <div style={styles.keywordRow}>
                  <div>
                    <div style={styles.keywordLabel}>Comment keyword</div>
                    <div style={styles.keywordValue}>{post.keyword || 'None detected'}</div>
                  </div>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => handleCopyKeyword(post.keyword)}
                    disabled={!post.keyword}
                  >
                    Copy keyword
                  </button>
                </div>

                <div style={styles.resourceRow}>
                  <div style={styles.resourceLabel}>Resource link</div>
                  <div style={styles.resourceInputRow}>
                    <input
                      type="url"
                      placeholder={post.resource_link || 'Paste the link you received'}
                      value={linkDrafts[post.id] ?? ''}
                      onChange={(e) => handleLinkDraftChange(post.id, e.target.value)}
                      style={styles.resourceInput}
                    />
                    <button
                      style={styles.primaryButton}
                      onClick={() => handleSaveLink(post.id)}
                      disabled={savingLinkId === post.id}
                    >
                      {savingLinkId === post.id ? 'Saving...' : 'Save link'}
                    </button>
                  </div>
                  {post.resource_link && (
                    <div style={styles.savedLink}>Saved: {post.resource_link}</div>
                  )}
                </div>
              </article>
            ))}
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
  statusDot: (color) => ({
    color,
    fontSize: '1.1rem',
    lineHeight: 1
  }),
  listSection: {
    marginTop: '1.25rem',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '1.25rem',
    boxShadow: '0 10px 30px rgba(17, 24, 39, 0.04)'
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem'
  },
  listTitle: {
    margin: 0,
    fontSize: '1.25rem'
  },
  listSubtitle: {
    margin: 0,
    color: '#6b7280'
  },
  countBadge: {
    background: '#111827',
    color: '#fff',
    borderRadius: '999px',
    padding: '0.35rem 0.9rem',
    fontWeight: 700,
    minWidth: '44px',
    textAlign: 'center'
  },
  emptyBox: {
    padding: '1rem',
    border: '1px dashed #d1d5db',
    borderRadius: '12px',
    color: '#6b7280'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1rem'
  },
  postCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1rem',
    background: '#fafbff',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  creatorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  creatorName: {
    fontWeight: 700
  },
  sourcePill: {
    background: '#e5e7eb',
    color: '#111827',
    padding: '0.25rem 0.6rem',
    borderRadius: '10px',
    fontSize: '0.85rem'
  },
  statusPill: {
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    textTransform: 'capitalize',
    fontWeight: 700,
    fontSize: '0.85rem'
  },
  postBody: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start'
  },
  thumbnail: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: '10px',
    border: '1px solid #e5e7eb'
  },
  thumbnailPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: '10px',
    border: '1px dashed #d1d5db',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem'
  },
  urlText: {
    fontSize: '0.9rem',
    color: '#4b5563',
    wordBreak: 'break-all'
  },
  captionText: {
    fontSize: '1rem',
    color: '#111827',
    lineHeight: 1.5,
    marginTop: '0.35rem'
  },
  tagRow: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap'
  },
  tagPill: {
    background: '#111827',
    color: '#fff',
    padding: '0.25rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.85rem'
  },
  tagMuted: {
    color: '#9ca3af'
  },
  keywordRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  keywordLabel: {
    fontSize: '0.9rem',
    color: '#6b7280'
  },
  keywordValue: {
    fontWeight: 700
  },
  secondaryButton: {
    padding: '0.65rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 600
  },
  resourceRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  resourceLabel: {
    fontWeight: 600
  },
  resourceInputRow: {
    display: 'flex',
    gap: '0.5rem'
  },
  resourceInput: {
    flex: 1,
    padding: '0.8rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid #d0d7de',
    fontSize: '1rem'
  },
  primaryButton: {
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: 'none',
    background: '#111827',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    minWidth: '120px'
  },
  savedLink: {
    fontSize: '0.95rem',
    color: '#4b5563',
    wordBreak: 'break-all'
  }
};
