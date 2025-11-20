"use strict";

const OEMBED_ENDPOINT = 'https://www.instagram.com/oembed/';

function cleanHtml(text) {
  if (!text) return null;
  return text.replace(/<[^>]+>/g, '').trim();
}

function extractMeta(html, key) {
  const metaRegex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    'i'
  );
  const match = html.match(metaRegex);
  return match ? match[1] : null;
}

async function fetchOEmbedMetadata(url) {
  const response = await fetch(
    `${OEMBED_ENDPOINT}?url=${encodeURIComponent(url)}&omitscript=true`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`oEmbed responded with ${response.status}`);
  }

  const payload = await response.json();
  return {
    thumbnail_url: payload.thumbnail_url || null,
    caption: payload.title || cleanHtml(payload.html) || null,
    creator_name: payload.author_name || null,
    source: 'oembed'
  };
}

async function fetchFallbackMetadata(url) {
  const response = await fetch(url, {
    headers: {
      // Pretend to be a browser to avoid basic bot blocks.
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`page responded with ${response.status}`);
  }

  const html = await response.text();

  const thumbnail = extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image');
  const caption =
    extractMeta(html, 'og:title') ||
    extractMeta(html, 'og:description') ||
    extractMeta(html, 'description');
  const creator = extractMeta(html, 'author') || extractMeta(html, 'og:site_name');

  return {
    thumbnail_url: thumbnail || null,
    caption: caption || null,
    creator_name: creator || null,
    source: 'fallback'
  };
}

export async function fetchPostMetadata(url) {
  try {
    return await fetchOEmbedMetadata(url);
  } catch (error) {
    // Fallback to scraping open graph data when oEmbed fails.
    return await fetchFallbackMetadata(url);
  }
}
