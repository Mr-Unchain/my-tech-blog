import { describe, expect, it } from 'vitest';
import { ArticleValidationAggregateError } from '../../../src/lib/articles/errors';
import {
  getAllValidatedArticles,
  getPublicArticleById,
  getPublicArticles,
  type ArticleCollectionReader,
} from '../../../src/lib/articles/repository';

const reader: ArticleCollectionReader = async () => [
  {
    id: 'public',
    data: {
      id: 'public',
      title: 'Public',
      description: 'Public article',
      category: ['Astro'],
      draft: false,
      eyecatch: 'https://example.com/public.png',
      publishedAt: '2026-07-17T00:00:00.000Z',
    },
    body: 'Public body',
  },
  {
    id: 'draft',
    data: {
      id: 'draft',
      title: 'Draft',
      description: 'Draft article',
      category: ['Draft'],
      draft: true,
    },
    body: 'Draft body',
  },
];

describe('article repository', () => {
  it('returns every validated article', async () => {
    await expect(getAllValidatedArticles(reader)).resolves.toHaveLength(2);
  });

  it('never returns drafts from the public boundary', async () => {
    const articles = await getPublicArticles(reader);
    expect(articles.map((article) => article.id)).toEqual(['public']);
    await expect(getPublicArticleById('draft', reader)).resolves.toBeNull();
    await expect(getPublicArticleById('public', reader)).resolves.toMatchObject(
      { id: 'public' }
    );
  });

  it('throws one aggregate error instead of returning partial data', async () => {
    const invalidReader: ArticleCollectionReader = async () => [
      ...(await reader()),
      { id: 'broken', data: { id: 'broken' }, body: '' },
    ];
    await expect(getAllValidatedArticles(invalidReader)).rejects.toBeInstanceOf(
      ArticleValidationAggregateError
    );
  });
});
