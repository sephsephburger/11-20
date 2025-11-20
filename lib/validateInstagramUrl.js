"use strict";

const allowedHosts = ['instagram.com', 'instagr.am'];
const allowedPaths = ['p', 'reel', 'tv'];

export function validateInstagramUrl(raw) {
  const trimmed = (raw || '').trim();
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

export function getAllowedHosts() {
  return allowedHosts;
}

export function getAllowedPaths() {
  return allowedPaths;
}
