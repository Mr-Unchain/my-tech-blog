import { parseFrontmatter } from '@astrojs/markdown-remark';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  ArticleSourceRecord,
  ArticleValidationError,
  ParsedArticleSource,
} from './types';

const defaultSourceRoot = new URL('../../content/blog/', import.meta.url);

const toAbsolutePath = (root: string | URL): string =>
  root instanceof URL ? fileURLToPath(root) : path.resolve(root);

const toSafeSourcePath = (absolutePath: string): string => {
  const relativePath = path.relative(process.cwd(), absolutePath);
  const safePath = relativePath.startsWith('..')
    ? path.basename(absolutePath)
    : relativePath;
  return safePath.replaceAll('\\', '/');
};

export const scanArticleSources = async (
  sourceRoot: string | URL = defaultSourceRoot
): Promise<{
  sources: ArticleSourceRecord[];
  errors: ArticleValidationError[];
}> => {
  const root = toAbsolutePath(sourceRoot);
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return {
      sources: [],
      errors: [
        {
          sourcePath: toSafeSourcePath(root),
          field: 'source',
          code: 'SOURCE_DIRECTORY_READ',
          message: 'The article source directory could not be read.',
        },
      ],
    };
  }

  const sources: ArticleSourceRecord[] = [];
  const errors: ArticleValidationError[] = [];
  const filenames = entries
    .filter((entry) => entry.isFile() && /\.mdx?$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  for (const filename of filenames) {
    const absolutePath = path.join(root, filename);
    const sourcePath = toSafeSourcePath(absolutePath);
    try {
      sources.push({
        absolutePath,
        sourcePath,
        filenameStem: path.basename(filename, path.extname(filename)),
        content: await readFile(absolutePath, 'utf8'),
      });
    } catch {
      errors.push({
        sourcePath,
        field: 'source',
        code: 'SOURCE_FILE_READ',
        message: 'The article source file could not be read.',
      });
    }
  }

  return { sources, errors };
};

export const parseArticleSource = (
  source: ArticleSourceRecord
): ParsedArticleSource => {
  const parsed = parseFrontmatter(source.content, { frontmatter: 'remove' });
  return {
    ...source,
    frontmatter: parsed.frontmatter,
    body: parsed.content,
  };
};
