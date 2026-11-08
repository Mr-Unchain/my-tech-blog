import { afterEach, describe, expect, it, vi } from 'vitest';
import { getBlogDetail, getBlogs } from '../../src/lib/blogs';
import type { ArticleCollectionReader } from '../../src/lib/articles/repository';

const reader: ArticleCollectionReader = async () => [
  {
    id: 'first',
    data: {
      id: 'first',
      title: 'First',
      description: 'First article',
      category: ['Astro'],
      draft: false,
      publishedAt: '2026-01-01T00:00:00Z',
      eyecatch: '/placeholder.svg',
    },
    body: '# Hello',
    rendered: { html: '<h1 id="hello">Hello</h1>' },
  },
  {
    id: 'second',
    data: {
      id: 'second',
      title: 'Second',
      description: 'Second article',
      category: ['Git'],
      draft: false,
      publishedAt: '2026-02-01T00:00:00Z',
      eyecatch: '/placeholder.svg',
    },
    body: 'Body',
    rendered: { html: '<p>Body</p>' },
  },
  {
    id: 'private-draft',
    data: {
      id: 'private-draft',
      title: 'Private',
      description: 'Private article',
      category: ['Draft-only'],
      draft: true,
    },
    body: 'Unpublished body',
    rendered: { html: '<p>Unpublished body</p>' },
  },
];

afterEach(() => vi.unstubAllEnvs());

describe('Markdown blog queries', () => {
  it('sorts and paginates public articles while preserving the total count', async () => {
    const result = await getBlogs({ limit: 1 }, reader);
    expect(result.totalCount).toBe(2);
    expect(result.contents.map((post) => post.id)).toEqual(['second']);
    expect(
      (await getBlogs({ offset: 1 }, reader)).contents.map((post) => post.id)
    ).toEqual(['first']);
  });

  it('keeps drafts out of category, search and bookmark queries', async () => {
    for (const query of [
      { filters: 'category[contains]Draft-only' },
      { q: 'Unpublished' },
      { filters: 'id[equals]private-draft' },
    ]) {
      expect((await getBlogs(query, reader)).contents).toEqual([]);
    }
    expect(
      (await getBlogs({ filters: 'category[contains]Astro' }, reader))
        .contents[0].id
    ).toBe('first');
    expect(
      (
        await getBlogs(
          { filters: 'id[equals]second[or]id[equals]first' },
          reader
        )
      ).totalCount
    ).toBe(2);
  });

  it('returns rendered Markdown and preserves IDs and image paths', async () => {
    const post = await getBlogDetail('first', {}, reader);
    expect(post).toMatchObject({
      id: 'first',
      content: '<h1 id="hello">Hello</h1>',
      eyecatch: { url: '/placeholder.svg' },
    });
    expect(await getBlogDetail('missing', {}, reader)).toBeNull();
  });

  it('only permits draft detail previews in development', async () => {
    vi.stubEnv('DEV', false);
    expect(
      await getBlogDetail('private-draft', { includeDrafts: true }, reader)
    ).toBeNull();
    vi.stubEnv('DEV', true);
    expect(await getBlogDetail('private-draft', {}, reader)).toBeNull();
    expect(
      await getBlogDetail('private-draft', { includeDrafts: true }, reader)
    ).toMatchObject({ draft: true });
  });
});
