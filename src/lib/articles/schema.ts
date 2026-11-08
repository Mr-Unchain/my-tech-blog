import { z } from 'astro/zod';

const safeText = (field: string, maximum: number) =>
  z
    .string({ required_error: `${field} is required.` })
    .trim()
    .min(1, `${field} must not be empty.`)
    .max(maximum, `${field} must be ${maximum} characters or fewer.`)
    .refine((value) => !/[<>]/.test(value), `${field} must not contain HTML.`);

const dateTime = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.string().datetime({ offset: true }),
);

const eyecatchUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (/^\/(?!\/)[^\s\\<>]*$/.test(value)) return true;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password;
    } catch {
      return false;
    }
  }, 'eyecatch must be a project-relative path or HTTPS URL.');

export const articleFrontmatterSchema = z
  .object({
    id: z
      .string({ required_error: 'id is required.' })
      .trim()
      .min(1, 'id must not be empty.')
      .max(128, 'id must be 128 characters or fewer.')
      .regex(/^[A-Za-z0-9_-]+$/, 'id must be URL-safe.'),
    title: safeText('title', 120),
    description: safeText('description', 240),
    category: z
      .array(z.string().trim().min(1, 'category values must not be empty.'))
      .min(1, 'category must contain at least one value.'),
    eyecatch: eyecatchUrl.optional(),
    draft: z.boolean().default(false),
    publishedAt: dateTime.optional(),
    updatedAt: dateTime.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.draft && !value.publishedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['publishedAt'],
        message: 'publishedAt is required for a public article.',
      });
    }
    if (!value.draft && !value.eyecatch) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['eyecatch'],
        message: 'eyecatch is required for a public article.',
      });
    }
    if (
      value.publishedAt &&
      value.updatedAt &&
      Date.parse(value.updatedAt) < Date.parse(value.publishedAt)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['updatedAt'],
        message: 'updatedAt must not be earlier than publishedAt.',
      });
    }
  });

export type ValidatedArticleFrontmatter = z.infer<
  typeof articleFrontmatterSchema
>;
