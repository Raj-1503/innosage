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
	// GitHub Pages sets these in .github/workflows/deploy.yml. Other hosts can use the defaults.
	site: process.env.SITE_URL || 'https://innosage.in',
	base: process.env.BASE_PATH || '/',
	// Keystatic's admin routes have no trailing slash, so only enforce it in builds.
	trailingSlash: isDev ? 'ignore' : 'always',
	prefetch: { prefetchAll: true },
	integrations: [react(), markdoc(), sitemap(), ...(isDev ? [keystatic()] : [])],
	vite: {
		plugins: [tailwindcss()],
	},
});
