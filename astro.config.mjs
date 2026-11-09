// @ts-check
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { defineConfig } from 'astro/config';

// Keystatic needs server routes, so it only runs locally. Builds stay fully static.
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
	site: 'https://innosage.in',
	integrations: [react(), markdoc(), ...(isDev ? [keystatic()] : [])],
});
