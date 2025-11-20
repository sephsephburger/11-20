import { NextResponse } from 'next/server';
import { getDb } from '../../../../db/client';

export const runtime = 'nodejs';

export async function PATCH(_request, { params }) {
  try {
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
    }

    const body = await _request.json();
    const resourceLink = body?.resource_link;
    const status = body?.status;

    if (!resourceLink && !status) {
      return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
    }

    const db = getDb();
    const update = db.prepare(
      `
      UPDATE posts
      SET resource_link = COALESCE(?, resource_link),
          status = COALESCE(?, status)
      WHERE id = ?
    `
    );

    const finalStatus = status || (resourceLink ? 'received' : null);
    update.run(resourceLink || null, finalStatus, id);

    const row = db
      .prepare(
        `SELECT id, instagram_url, thumbnail_url, caption, creator_name, tags, keyword, status, resource_link, created_at
         FROM posts WHERE id = ?`
      )
      .get(id);

    if (!row) {
      return NextResponse.json({ error: 'Post not found after update' }, { status: 404 });
    }

    return NextResponse.json({
      post: { ...row, tags: row.tags ? row.tags.split(',').filter(Boolean) : [] }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}
