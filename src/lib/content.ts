import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

const projectImages = import.meta.glob<{ default: ImageMetadata }>('/src/assets/projects/*/*.{webp,jpg,jpeg,png}', {
	eager: true,
});

// Evenly spaced images from a case study, so new projects get thumbnails without extra CMS work.
export function getProjectThumbs(project: CollectionEntry<'projects'>, count = 3) {
	const paths = [...(project.body ?? '').matchAll(/!\[[^\]]*\]\(\.\.\/\.\.\/assets\/([^)]+)\)/g)].map(
		(match) => `/src/assets/${match[1]}`,
	);
	const images = paths.flatMap((path) => projectImages[path]?.default ?? []);
	if (images.length <= count) return images;
	return Array.from({ length: count }, (_, index) => images[Math.floor(((index + 0.5) * images.length) / count)]);
}

export async function getProjects() {
	const projects = await getCollection('projects');
	return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects() {
	const projects = await getCollection('projects', ({ data }) => data.featured);
	return projects.sort((a, b) => a.data.homeOrder - b.data.homeOrder);
}

export async function getPosts() {
	const posts = await getCollection('blogs', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
}
