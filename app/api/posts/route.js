import { NextResponse } from 'next/server';
import { getDb } from '../../../db/client';
import { fetchPostMetadata } from '../../../lib/fetchInstagramMetadata';
import { validateInstagramUrl } from '../../../lib/validateInstagramUrl';
import { classifyCaption, extractCommentKeyword } from '../../../lib/analyzeCaption';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT id, instagram_url, thumbnail_url, caption, creator_name, tags, keyword, status, resource_link, created_at
         FROM posts
         ORDER BY created_at DESC`
      )
      .all();

    const posts = rows.map((row) => ({
      ...row,
      tags: row.tags ? row.tags.split(',').filter(Boolean) : []
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const url = body?.url;

    const validation = validateInstagramUrl(url);
    if (validation.type !== 'success') {
      return NextResponse.json(
        { error: validation.message, code: validation.code },
        { status: 400 }
      );
    }

    const metadata = await fetchPostMetadata(url);
    const tags = classifyCaption(metadata.caption || '');
    const keyword = extractCommentKeyword(metadata.caption || '');
    const status = keyword ? 'requested' : 'not requested';

    const db = getDb();
    const insert = db.prepare(
      `
      INSERT INTO posts (instagram_url, thumbnail_url, caption, creator_name, tags, keyword, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    );

    const result = insert.run(
      url.trim(),
      metadata.thumbnail_url,
      metadata.caption,
      metadata.creator_name,
      tags.join(','),
      keyword,
      status
    );

    return NextResponse.json(
      {
        post: {
          id: result.lastInsertRowid,
          instagram_url: url.trim(),
          thumbnail_url: metadata.thumbnail_url,
          caption: metadata.caption,
          creator_name: metadata.creator_name,
          tags,
          keyword,
          status,
          source: metadata.source
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
