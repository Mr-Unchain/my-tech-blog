import type { Article, ArticleFrontmatter, ParsedArticleSource } from './types';

export const mapArticle = (
  source: Pick<ParsedArticleSource, 'sourcePath' | 'body'>,
  frontmatter: ArticleFrontmatter
): Article => ({
  id: frontmatter.id,
  urlPath: `/blog/${frontmatter.id}/`,
  title: frontmatter.title.trim(),
  description: frontmatter.description.trim(),
  content: source.body.trim(),
  category: [...new Set(frontmatter.category.map((value) => value.trim()))],
  eyecatch: frontmatter.eyecatch
    ? {
        url: frontmatter.eyecatch,
        sourceType: frontmatter.eyecatch.startsWith('/')
          ? 'local-path'
          : 'remote-url',
      }
    : undefined,
  publicationState: frontmatter.draft ? 'draft' : 'published',
  publishedAt: frontmatter.publishedAt
    ? new Date(frontmatter.publishedAt).toISOString()
    : undefined,
  updatedAt: frontmatter.updatedAt
    ? new Date(frontmatter.updatedAt).toISOString()
    : undefined,
  sourcePath: source.sourcePath,
});
