import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '@/lib/content';

export async function GET(context: APIContext) {
	const posts = await getPosts();
	return rss({
		title: 'Innosage',
		description: 'Insights, work approaches, ideas. Read it all.',
		site: context.site!,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.excerpt,
			pubDate: post.data.publishedDate,
			categories: post.data.categories,
			link: `/blogs/${post.id}/`,
		})),
	});
}
