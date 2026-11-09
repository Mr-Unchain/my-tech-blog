import {
  getAllValidatedArticles,
  getPublicArticles,
  type ArticleCollectionReader,
} from './articles/repository';
import type { Article } from './articles/types';
import type { Blog } from './microcms';

export interface BlogQueries {
  limit?: number;
  offset?: number;
  orders?: string;
  fields?: string | string[];
  filters?: string;
  q?: string;
}

const toBlog = async (article: Article): Promise<Blog & { draft: boolean }> => {
  const content = article.renderedHtml;
  if (content === undefined)
    throw new Error('The article has not been rendered by Astro.');
  const publishedAt = article.publishedAt ?? '';
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    content,
    category: [...article.category],
    eyecatch: { url: article.eyecatch?.url ?? '/placeholder.svg' },
    publishedAt,
    updatedAt: article.updatedAt ?? publishedAt,
    createdAt: publishedAt,
    revisedAt: article.updatedAt ?? publishedAt,
    draft: article.publicationState === 'draft',
  };
};

const matchesFilter = (article: Article, filter: string): boolean => {
  if (filter.startsWith('category[contains]')) {
    return article.category.includes(filter.slice('category[contains]'.length));
  }
  const terms = filter.split('[or]');
  if (!terms.every((term) => /^id\[equals\][A-Za-z0-9_-]+$/.test(term))) {
    throw new Error('Unsupported article filter.');
  }
  return terms.some((term) => article.id === term.slice('id[equals]'.length));
};

// All listing surfaces use this public-only boundary, including local dev.
export const getBlogs = async (
  queries: BlogQueries = {},
  reader?: ArticleCollectionReader
) => {
  let articles = await getPublicArticles(reader);
  if (queries.filters) {
    articles = articles.filter((article) =>
      matchesFilter(article, queries.filters!)
    );
  }
  if (queries.q) {
    const query = queries.q.toLocaleLowerCase();
    articles = articles.filter((article) =>
      `${article.title}\n${article.description}\n${article.content}`
        .toLocaleLowerCase()
        .includes(query)
    );
  }
  const order = queries.orders ?? '-publishedAt';
  const ascending = !order.startsWith('-');
  const requestedField = order.replace(/^-/, '');
  const field =
    requestedField === 'title' || requestedField === 'updatedAt'
      ? requestedField
      : 'publishedAt';
  articles.sort((left, right) => {
    const comparison = (left[field] ?? '').localeCompare(right[field] ?? '');
    return (
      (ascending ? comparison : -comparison) || left.id.localeCompare(right.id)
    );
  });
  const totalCount = articles.length;
  const offset = Number.isFinite(queries.offset)
    ? Math.max(0, Math.floor(queries.offset!))
    : 0;
  const limit = Number.isFinite(queries.limit)
    ? Math.max(0, Math.floor(queries.limit!))
    : totalCount;
  const contents = await Promise.all(
    articles.slice(offset, offset + limit).map(toBlog)
  );
  return { contents, totalCount, offset, limit };
};

export const getPublicBlogsByIds = async (
  ids: string[],
  reader?: ArticleCollectionReader
): Promise<Blog[]> => {
  if (ids.length === 0) return [];
  const articlesById = new Map(
    (await getPublicArticles(reader)).map((article) => [article.id, article])
  );
  return Promise.all(
    ids.flatMap((id) => {
      const article = articlesById.get(id);
      return article ? [toBlog(article)] : [];
    })
  );
};

export const getBlogDetail = async (
  id: string,
  options: { includeDrafts?: boolean } = {},
  reader?: ArticleCollectionReader
) => {
  const allowDrafts = import.meta.env.DEV && options.includeDrafts === true;
  const articles = allowDrafts
    ? await getAllValidatedArticles(reader)
    : await getPublicArticles(reader);
  const article = articles.find((entry) => entry.id === id);
  return article ? toBlog(article) : null;
};

export const getLocalDrafts = async () => {
  if (!import.meta.env.DEV) return [];
  return (await getAllValidatedArticles()).filter(
    (article) => article.publicationState === 'draft'
  );
};
