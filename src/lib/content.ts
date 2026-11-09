import { getCollection } from 'astro:content';

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
