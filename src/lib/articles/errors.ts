import type { ArticleValidationError } from './types';

const compareErrors = (
  left: ArticleValidationError,
  right: ArticleValidationError
) =>
  left.sourcePath.localeCompare(right.sourcePath) ||
  left.field.localeCompare(right.field) ||
  left.code.localeCompare(right.code) ||
  left.message.localeCompare(right.message);

export const normalizeValidationErrors = (
  errors: ArticleValidationError[]
): ArticleValidationError[] => {
  const unique = new Map<string, ArticleValidationError>();
  for (const error of errors) {
    unique.set(
      [error.sourcePath, error.field, error.code, error.message].join('\0'),
      error
    );
  }
  return [...unique.values()].sort(compareErrors);
};

export const formatValidationErrors = (
  errors: ArticleValidationError[]
): string =>
  normalizeValidationErrors(errors)
    .map(
      ({ sourcePath, field, code, message }) =>
        `${sourcePath} [${field}] ${code}: ${message}`
    )
    .join('\n');

export class ArticleValidationAggregateError extends Error {
  readonly errors: ArticleValidationError[];

  constructor(errors: ArticleValidationError[]) {
    const normalized = normalizeValidationErrors(errors);
    super(
      `Article validation failed with ${normalized.length} error(s).\n${formatValidationErrors(normalized)}`
    );
    this.name = 'ArticleValidationAggregateError';
    this.errors = normalized;
  }
}
