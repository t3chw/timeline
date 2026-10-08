import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const KINDS = ['study', 'build', 'practice', 'read', 'idea'] as const;

// One Markdown file per note in src/content/entries/. Files starting with "_" are ignored.
const entries = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/entries' }),
  schema: z.object({
    title: z.string().min(1),
    // Day the note belongs to, written as 2026-10-08
    date: z.coerce.date(),
    // Optional clock time, written in quotes: "14:30"
    time: z
      .string()
      .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'time must look like "14:30" (24h, in quotes)')
      .optional(),
    // What it belongs to: "Python", "System Design", ... Reuse names so notes group together.
    subject: z.string().min(1),
    kind: z.enum(KINDS).default('study'),
    tags: z.array(z.string()).default([]),
    // One or two sentences shown on the timeline card
    summary: z.string().optional(),
    // Minutes spent
    duration: z.number().int().positive().optional(),
    links: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
    // Drafts show in `npm run dev` but are left out of the deployed site
    draft: z.boolean().default(false),
  }),
});

export const collections = { entries };
