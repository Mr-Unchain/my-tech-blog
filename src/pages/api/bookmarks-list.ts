// src/pages/api/bookmarks-list.ts
// ブックマーク済み記事の詳細情報を microCMS から一括取得する API
import type { APIRoute } from 'astro';
import { getBlogs } from '../../lib/microcms';

export const GET: APIRoute = async ({ url }) => {
  const ids = url.searchParams.get('ids');

  if (!ids) {
    return new Response(
      JSON.stringify({ articles: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const idList = ids.split(',').filter(Boolean);

  if (idList.length === 0) {
    return new Response(
      JSON.stringify({ articles: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // microCMS のフィルタで複数 ID を取得
    const filters = idList.map(id => `id[equals]${id}`).join('[or]');
    const data = await getBlogs({
      filters,
      fields: ['id', 'title', 'publishedAt', 'eyecatch', 'category'],
      limit: idList.length,
    });

    return new Response(
      JSON.stringify({ articles: data.contents }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching bookmarked articles:', error);
    return new Response(
      JSON.stringify({ articles: [], error: 'Failed to fetch articles' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
