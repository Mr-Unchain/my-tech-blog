import { describe, expect, it } from 'vitest';
import { articleFrontmatterSchema } from '../../../src/lib/articles/schema';

const publicArticle = {
  id: 'article-1',
  title: 'Article title',
  description: 'Article description',
  category: ['Astro'],
  eyecatch: 'https://example.com/image.png',
  publishedAt: '2026-07-17T00:00:00.000Z',
};

describe('articleFrontmatterSchema', () => {
  it('accepts and normalizes a public article', () => {
    const result = articleFrontmatterSchema.parse(publicArticle);

    expect(result.draft).toBe(false);
    expect(result.id).toBe('article-1');
  });

  it('allows a draft without publication metadata', () => {
    expect(
      articleFrontmatterSchema.safeParse({
        ...publicArticle,
        draft: true,
        publishedAt: undefined,
        eyecatch: undefined,
      }).success
    ).toBe(true);
  });

  it('requires publishedAt and eyecatch for a public article', () => {
    const result = articleFrontmatterSchema.safeParse({
      ...publicArticle,
      publishedAt: undefined,
      eyecatch: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join('.'))).toEqual([
        'publishedAt',
        'eyecatch',
      ]);
    }
  });

  it.each([
    'javascript:alert(1)',
    'data:image/png;base64,abc',
    'http://example.com/a.png',
  ])('rejects unsafe eyecatch URL %s', (eyecatch) => {
    expect(
      articleFrontmatterSchema.safeParse({ ...publicArticle, eyecatch }).success
    ).toBe(false);
  });

  it('rejects unsafe IDs, HTML text, empty categories, and reversed dates', () => {
    const result = articleFrontmatterSchema.safeParse({
      ...publicArticle,
      id: '../article',
      title: '<script>',
      category: [''],
      updatedAt: '2026-07-16T00:00:00.000Z',
    });

    expect(result.success).toBe(false);
  });
});
