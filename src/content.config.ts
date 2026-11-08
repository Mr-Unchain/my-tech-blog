import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { articleFrontmatterSchema } from './lib/articles/schema';

const blog = defineCollection({
  loader: glob({
    base: './src/content',
    pattern: import.meta.env.DEV ? ['blog/*.md', 'drafts/*.md'] : 'blog/*.md',
    retainBody: true,
    generateId: ({ entry }) => entry.split('/').at(-1)!.replace(/\.md$/i, ''),
  }),
  schema: articleFrontmatterSchema,
});

export const collections = { blog };
