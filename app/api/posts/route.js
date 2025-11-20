"use server";

import { NextResponse } from 'next/server';
import { getDb } from '../../../db/client';
import { fetchPostMetadata } from '../../../lib/fetchInstagramMetadata';
import { validateInstagramUrl } from '../../../lib/validateInstagramUrl';

export const runtime = 'nodejs';

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

    const db = getDb();
    const insert = db.prepare(
      `
      INSERT INTO posts (instagram_url, thumbnail_url, caption, creator_name, status)
      VALUES (?, ?, ?, ?, ?)
    `
    );

    const result = insert.run(
      url.trim(),
      metadata.thumbnail_url,
      metadata.caption,
      metadata.creator_name,
      'not requested'
    );

    return NextResponse.json(
      {
        post: {
          id: result.lastInsertRowid,
          instagram_url: url.trim(),
          thumbnail_url: metadata.thumbnail_url,
          caption: metadata.caption,
          creator_name: metadata.creator_name,
          status: 'not requested',
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
