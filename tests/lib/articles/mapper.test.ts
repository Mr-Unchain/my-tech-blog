import { describe, expect, it } from 'vitest';
import { mapArticle } from '../../../src/lib/articles/mapper';

describe('mapArticle', () => {
  it('normalizes article fields and derives its public URL', () => {
    const article = mapArticle(
      { sourcePath: 'src/content/blog/article-1.mdx', body: '  Body  ' },
      {
        id: 'article-1',
        title: ' Title ',
        description: ' Description ',
        category: ['Astro', 'Astro', ' TypeScript '],
        draft: false,
        eyecatch: '/images/article.png',
        publishedAt: '2026-07-17T09:00:00+09:00',
      }
    );

    expect(article).toMatchObject({
      id: 'article-1',
      urlPath: '/blog/article-1/',
      title: 'Title',
      description: 'Description',
      content: 'Body',
      category: ['Astro', 'TypeScript'],
      publicationState: 'published',
      eyecatch: { url: '/images/article.png', sourceType: 'local-path' },
      publishedAt: '2026-07-17T00:00:00.000Z',
    });
  });

  it('maps a draft without public metadata', () => {
    const article = mapArticle(
      { sourcePath: 'src/content/blog/draft.mdx', body: 'Body' },
      {
        id: 'draft',
        title: 'Draft',
        description: 'Draft description',
        category: ['Draft'],
        draft: true,
      }
    );

    expect(article.publicationState).toBe('draft');
    expect(article.eyecatch).toBeUndefined();
  });
});
