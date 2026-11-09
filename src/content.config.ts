import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.mdoc', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			seoTitle: z.string().optional(),
			client: z.string().optional(),
			year: z.string().optional(),
			summary: z.string().optional(),
			tagline: z.string().optional(),
			heroIntro: z.string().optional(),
			overview: z.string().optional(),
			heroColor: z.string().optional(),
			heroTextDark: z.boolean().default(false),
			coverImage: image().nullish(),
			heroImage: image().nullish(),
			heroVideo: z.string().nullish(),
			hoverVideo: z.string().nullish(),
			disciplines: z.array(z.string()).default([]),
			services: z.array(z.string()).default([]),
			testimonial: z
				.object({
					quote: z.string().optional(),
					name: z.string().optional(),
					role: z.string().optional(),
				})
				.optional(),
			featured: z.boolean().default(false),
			homeBlurb: z.string().optional(),
			homeOrder: z.number().default(0),
			comingSoon: z.boolean().default(false),
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
