import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { formatValidationErrors } from '../../../src/lib/articles/errors';
import {
  validateContent,
  validateParsedArticleSources,
} from '../../../src/lib/articles/validation';

const fixture = (name: string) =>
  path.resolve(process.cwd(), 'tests', 'fixtures', 'articles', name);
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true }))
  );
});

describe('validateContent', () => {
  it('rejects a published flag inside the local-only drafts folder', () => {
    const result = validateParsedArticleSources([
      {
        absolutePath: '',
        sourcePath: 'src/content/drafts/local.md',
        filenameStem: 'local',
        content: '',
        body: 'Body',
        frontmatter: {
          id: 'local',
          title: 'Local',
          description: 'Local draft',
          category: ['Test'],
          draft: false,
          publishedAt: '2026-11-08T00:00:00Z',
          eyecatch: '/placeholder.svg',
        },
      },
    ]);
    expect(result.success).toBe(false);
    expect(result.errors.some((error) => error.field === 'draft')).toBe(true);
  });
  it('returns valid public and draft articles', async () => {
    const result = await validateContent({ sourceRoot: fixture('valid') });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.articles.map((article) => article.id)).toEqual([
        'draft',
        'public',
      ]);
    }
  });

  it.each([
    ['multiple-errors', 'FRONTMATTER_INVALID'],
    ['duplicate', 'ARTICLE_ID_DUPLICATE'],
    ['filename-mismatch', 'ARTICLE_ID_FILENAME_MISMATCH'],
    ['empty-body', 'ARTICLE_BODY_EMPTY'],
    ['malformed', 'FRONTMATTER_PARSE'],
  ])('fails closed for the %s fixture', async (fixtureName, expectedCode) => {
    const result = await validateContent({ sourceRoot: fixture(fixtureName) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.articles).toEqual([]);
      expect(result.errors.some((error) => error.code === expectedCode)).toBe(
        true
      );
    }
  });

  it('aggregates deterministic errors without raw frontmatter values', async () => {
    const result = await validateContent({
      sourceRoot: fixture('multiple-errors'),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(2);
      expect(formatValidationErrors(result.errors)).not.toContain('<script>');
      expect(result.errors).toEqual(
        [...result.errors].sort(
          (left, right) =>
            left.sourcePath.localeCompare(right.sourcePath) ||
            left.field.localeCompare(right.field) ||
            left.code.localeCompare(right.code) ||
            left.message.localeCompare(right.message)
        )
      );
    }
  });

  it('validates approximately 100 articles', async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'article-validation-'));
    temporaryDirectories.push(directory);
    await Promise.all(
      Array.from({ length: 100 }, (_, index) => {
        const id = `article-${index}`;
        return writeFile(
          path.join(directory, `${id}.md`),
          `---\nid: ${id}\ntitle: Article ${index}\ndescription: Performance fixture\ncategory: [Test]\ndraft: true\n---\n\nBody ${index}\n`,
          'utf8'
        );
      })
    );
    const startedAt = performance.now();
    const result = await validateContent({ sourceRoot: directory });
    expect(result.success).toBe(true);
    if (result.success) expect(result.articles).toHaveLength(100);
    expect(performance.now() - startedAt).toBeLessThan(5000);
  });
});
