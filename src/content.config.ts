import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    section: z.enum(['key-ideas', 'modern-excel', 'excel-tips', 'beyond-excel']),
    order: z.number(),
    title: z.string(),
    excerpt: z.string(),
    // 'written' articles are real copy; 'placeholder' bodies say so in their
    // own first paragraph and must not ship to the Netlify launch — see
    // Build Notes > Content.
    status: z.enum(['written', 'placeholder']),
    // Only the three Key-ideas tiles carry the "Read this →" prompt.
    readThis: z.boolean().default(false),
    cta: z
      .object({
        label: z.string(),
        target: z.string(), // slug of another article in this collection
      })
      .optional(),
  }),
});

export const collections = { articles };
