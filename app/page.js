"use client";

import { useState } from 'react';

const allowedHosts = ['instagram.com', 'instagr.am'];
const allowedPaths = ['p', 'reel', 'tv'];

function evaluateInstagramUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      type: 'error',
      code: 'empty',
      message: 'Paste a public Instagram post link to continue.'
    };
  }

  let urlObject;
  try {
    urlObject = new URL(trimmed);
  } catch {
    return {
      type: 'error',
      code: 'invalid-url',
      message: 'Enter a full URL starting with http(s).'
    };
  }

  const hostname = urlObject.hostname.replace(/^www\./, '');
  if (!allowedHosts.includes(hostname)) {
    return {
      type: 'error',
      code: 'invalid-host',
      message: 'Use an instagram.com link (post, reel, or TV).'
    };
  }

  const parts = urlObject.pathname.split('/').filter(Boolean);
  if (parts.length < 2) {
    return {
      type: 'error',
      code: 'missing-slug',
      message: 'Use a post permalink such as /p/<id> or /reel/<id>.'
    };
  }

  const kind = parts[0];
  const slug = parts[1];
  if (!allowedPaths.includes(kind)) {
    return {
      type: 'error',
      code: 'private-or-unsupported',
      message:
        'This looks like profile or gated content. Use a public post, reel, or IGTV link.'
    };
  }

  if (!slug || slug.length < 5) {
    return {
      type: 'error',
      code: 'short-slug',
      message: 'The post ID looks incomplete; double-check the link.'
    };
  }

  const privateFlag =
    urlObject.searchParams.get('private') === 'true' ||
    urlObject.searchParams.get('is_private') === '1';
  if (privateFlag) {
    return {
      type: 'error',
      code: 'private-flag',
      message: 'This post appears private or requires login. Make it public before adding.'
    };
  }

  return {
    type: 'success',
    code: 'ok',
    message: 'Looks good. Next step: fetch metadata and store the post.'
  };
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const result = evaluateInstagramUrl(url);
    setStatus(result);
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
            />
            <button type="submit" style={styles.button}>
              Check URL
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
    minWidth: '120px'
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
  }
};
