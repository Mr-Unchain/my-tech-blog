import { ArticleValidationAggregateError } from './errors';
import { validateParsedArticleSources } from './validation';
import type { Article, ParsedArticleSource } from './types';
import path from 'node:path';

export interface ArticleCollectionEntry {
  id: string;
  data: unknown;
  body?: string;
  filePath?: string;
  rendered?: { html: string };
}

export type ArticleCollectionReader = () => Promise<ArticleCollectionEntry[]>;

const readBlogCollection: ArticleCollectionReader = async () => {
  const { getCollection } = await import('astro:content');
  return (await getCollection('blog')) as ArticleCollectionEntry[];
};

const toSafeSourcePath = (filePath: string | undefined, id: string): string => {
  if (!filePath) return `src/content/blog/${id}.mdx`;
  const normalized = filePath.replaceAll('\\', '/');
  if (!path.isAbsolute(filePath)) return normalized;
  const relative = path.relative(process.cwd(), filePath).replaceAll('\\', '/');
  return relative.startsWith('..') ? path.basename(filePath) : relative;
};

const toParsedSource = (
  entry: ArticleCollectionEntry
): ParsedArticleSource => ({
  absolutePath: '',
  sourcePath: toSafeSourcePath(entry.filePath, entry.id),
  filenameStem: entry.filePath
    ? (entry.filePath
        .replaceAll('\\', '/')
        .split('/')
        .at(-1)
        ?.replace(/\.mdx?$/i, '') ?? entry.id)
    : entry.id,
  content: '',
  frontmatter: entry.data,
  body: entry.body ?? '',
});

export const getAllValidatedArticles = async (
  reader: ArticleCollectionReader = readBlogCollection
): Promise<Article[]> => {
  const entries = await reader();
  const result = validateParsedArticleSources(entries.map(toParsedSource));
  if (!result.success) throw new ArticleValidationAggregateError(result.errors);
  const htmlById = new Map(
    entries.map((entry) => [entry.id, entry.rendered?.html])
  );
  return result.articles.map((article) => ({
    ...article,
    renderedHtml: htmlById.get(article.id),
  }));
};

export const getPublicArticles = async (
  reader: ArticleCollectionReader = readBlogCollection
): Promise<Article[]> =>
  (await getAllValidatedArticles(reader)).filter(
    (article) => article.publicationState === 'published'
  );

export const getPublicArticleById = async (
  id: string,
  reader: ArticleCollectionReader = readBlogCollection
): Promise<Article | null> =>
  (await getPublicArticles(reader)).find((article) => article.id === id) ??
  null;
