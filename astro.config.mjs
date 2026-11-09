// @ts-check
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// Keystatic needs server routes, so it only runs locally. Builds stay fully static.
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
	site: 'https://innosage.in',
	// Keystatic's admin routes have no trailing slash, so only enforce it in builds.
	trailingSlash: isDev ? 'ignore' : 'always',
	prefetch: { prefetchAll: true },
	integrations: [react(), markdoc(), sitemap(), ...(isDev ? [keystatic()] : [])],
	vite: {
		plugins: [tailwindcss()],
	},
});
