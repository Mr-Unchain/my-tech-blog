import { normalizeValidationErrors } from './errors';
import { mapArticle } from './mapper';
import { articleFrontmatterSchema } from './schema';
import { parseArticleSource, scanArticleSources } from './source';
import type {
  Article,
  ArticleValidationError,
  ArticleValidationResult,
  ParsedArticleSource,
  ValidationOptions,
} from './types';

export const validateArticleEntry = (
  source: ParsedArticleSource
): { article?: Article; errors: ArticleValidationError[] } => {
  const errors: ArticleValidationError[] = [];
  const parsed = articleFrontmatterSchema.safeParse(source.frontmatter);

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push({
        sourcePath: source.sourcePath,
        field: issue.path.join('.') || 'frontmatter',
        code: 'FRONTMATTER_INVALID',
        message: issue.message,
      });
    }
  }

  if (!source.body.trim()) {
    errors.push({
      sourcePath: source.sourcePath,
      field: 'body',
      code: 'ARTICLE_BODY_EMPTY',
      message: 'Article body must not be empty.',
    });
  }

  if (
    source.sourcePath.replaceAll('\\', '/').includes('/content/drafts/') &&
    parsed.success &&
    !parsed.data.draft
  ) {
    errors.push({
      sourcePath: source.sourcePath,
      field: 'draft',
      code: 'FRONTMATTER_INVALID',
      message: 'Files in the local drafts directory must set draft: true.',
    });
  }

  if (parsed.success && parsed.data.id !== source.filenameStem) {
    errors.push({
      sourcePath: source.sourcePath,
      field: 'id',
      code: 'ARTICLE_ID_FILENAME_MISMATCH',
      message: 'Article id must match the filename stem.',
    });
  }

  return errors.length || !parsed.success
    ? { errors }
    : { article: mapArticle(source, parsed.data), errors: [] };
};

export const validateParsedArticleSources = (
  sources: ParsedArticleSource[],
  initialErrors: ArticleValidationError[] = []
): ArticleValidationResult => {
  const errors = [...initialErrors];
  const articles: Article[] = [];

  for (const source of sources) {
    const result = validateArticleEntry(source);
    errors.push(...result.errors);
    if (result.article) articles.push(result.article);
  }

  const byId = new Map<string, ParsedArticleSource[]>();
  for (const source of sources) {
    const parsed = articleFrontmatterSchema.safeParse(source.frontmatter);
    if (!parsed.success) continue;
    const matches = byId.get(parsed.data.id) ?? [];
    matches.push(source);
    byId.set(parsed.data.id, matches);
  }
  for (const matches of byId.values()) {
    if (matches.length < 2) continue;
    for (const source of matches) {
      errors.push({
        sourcePath: source.sourcePath,
        field: 'id',
        code: 'ARTICLE_ID_DUPLICATE',
        message: 'Article id is duplicated.',
      });
    }
  }

  const normalized = normalizeValidationErrors(errors);
  return normalized.length
    ? { success: false, articles: [], errors: normalized }
    : { success: true, articles, errors: [] };
};

export const validateContent = async (
  options: ValidationOptions = {}
): Promise<ArticleValidationResult> => {
  const scan = await scanArticleSources(options.sourceRoot);
  const parsedSources: ParsedArticleSource[] = [];
  const errors = [...scan.errors];

  for (const source of scan.sources) {
    try {
      parsedSources.push(parseArticleSource(source));
    } catch {
      errors.push({
        sourcePath: source.sourcePath,
        field: 'frontmatter',
        code: 'FRONTMATTER_PARSE',
        message: 'Frontmatter could not be parsed.',
      });
    }
  }

  return validateParsedArticleSources(parsedSources, errors);
};
