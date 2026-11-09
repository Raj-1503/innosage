import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			client: z.string().optional(),
			summary: z.string().optional(),
			coverImage: image().nullish(),
			hoverVideo: z.string().nullish(),
			disciplines: z.array(z.string()).default([]),
			featured: z.boolean().default(false),
			order: z.number().default(0),
		}),
});

const blogs = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/content/blogs' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			excerpt: z.string().optional(),
			coverImage: image().nullish(),
			publishedDate: z.coerce.date(),
			author: z.string().optional(),
			categories: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

export const collections = { projects, blogs };
