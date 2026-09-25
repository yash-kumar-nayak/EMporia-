import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM');

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: ({ image }) =>
    z.object({
      client: z.string(),
      clientUrl: z.string().url().optional(),
      logo: image().optional(),
      industry: z.string(),
      location: z.string(),
      services: z.array(z.string()),
      period: z.object({ start: yearMonth, end: yearMonth }),
      headline: z.string(),
      summary: z.string(),
      featured: z.boolean().default(false),
      // true = layout demo with placeholder numbers. Shows a visible banner and is kept out of search.
      sample: z.boolean().default(false),
      metrics: z
        .array(
          z.object({
            label: z.string(),
            before: z.string(),
            after: z.string(),
            change: z.string().optional(),
            source: z.string(),
          }),
        )
        .min(1),
      revenue: z
        .object({
          label: z.string().default('Monthly revenue'),
          source: z.string(),
          startedMonth: yearMonth,
          series: z.array(z.object({ month: yearMonth, value: z.number() })).min(2),
        })
        .optional(),
      timeline: z.array(z.object({ when: z.string(), title: z.string(), detail: z.string() })).default([]),
      evidence: z
        .array(
          z.object({
            image: image().optional(),
            caption: z.string(),
            source: z.string(),
            period: z.string(),
            redactions: z.string().default('None — unedited screenshot'),
          }),
        )
        .default([]),
      testimonial: z
        .object({ quote: z.string(), name: z.string(), role: z.string(), photo: image().optional() })
        .optional(),
      reportPdf: z.string().optional(),
    }),
});

const areas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/areas' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    nearby: z.array(z.string()).default([]),
  }),
});

export const collections = { caseStudies, areas };
