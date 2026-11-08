export type PublicationState = 'draft' | 'published';

export interface ArticleImageReference {
  url: string;
  sourceType: 'local-path' | 'remote-url';
}

export interface ArticleFrontmatter {
  id: string;
  title: string;
  description: string;
  category: string[];
  draft: boolean;
  publishedAt?: string;
  updatedAt?: string;
  eyecatch?: string;
}

export interface Article {
  id: string;
  urlPath: string;
  title: string;
  description: string;
  content: string;
  renderedHtml?: string;
  category: string[];
  eyecatch?: ArticleImageReference;
  publicationState: PublicationState;
  publishedAt?: string;
  updatedAt?: string;
  sourcePath: string;
}

export type ArticleValidationErrorCode =
  | 'SOURCE_DIRECTORY_READ'
  | 'SOURCE_FILE_READ'
  | 'FRONTMATTER_PARSE'
  | 'FRONTMATTER_INVALID'
  | 'ARTICLE_BODY_EMPTY'
  | 'ARTICLE_ID_FILENAME_MISMATCH'
  | 'ARTICLE_ID_DUPLICATE';

export interface ArticleValidationError {
  sourcePath: string;
  field: string;
  code: ArticleValidationErrorCode;
  message: string;
}

export type ArticleValidationResult =
  | { success: true; articles: Article[]; errors: [] }
  | { success: false; articles: []; errors: ArticleValidationError[] };

export interface ArticleSourceRecord {
  absolutePath: string;
  sourcePath: string;
  filenameStem: string;
  content: string;
}

export interface ParsedArticleSource extends ArticleSourceRecord {
  frontmatter: unknown;
  body: string;
}

export interface ValidationOptions {
  sourceRoot?: string | URL;
}
