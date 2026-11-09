import { collection, config, fields } from '@keystatic/core';

export default config({
	storage: { kind: 'local' },
	ui: {
		brand: { name: 'Innosage' },
	},
	collections: {
		projects: collection({
			label: 'Projects',
			slugField: 'title',
			path: 'src/content/projects/*',
			format: { contentField: 'content' },
			entryLayout: 'content',
			columns: ['client', 'order'],
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				client: fields.text({ label: 'Client' }),
				summary: fields.text({
					label: 'Summary',
					description: 'Short line shown on project cards.',
					multiline: true,
				}),
				coverImage: fields.image({
					label: 'Cover image',
					directory: 'src/assets/projects',
					publicPath: '../../assets/projects/',
				}),
				hoverVideo: fields.file({
					label: 'Hover video',
					description: 'Optional preview played when hovering the project in the Works grid.',
					directory: 'public/videos/projects',
					publicPath: '/videos/projects/',
				}),
				disciplines: fields.array(fields.text({ label: 'Discipline' }), {
					label: 'Disciplines',
					description: 'For example Branding, Packaging, 3D Visualization, Strategy.',
					itemLabel: (props) => props.value,
				}),
				featured: fields.checkbox({
					label: 'Featured',
					description: 'Show this project on the home page.',
				}),
				order: fields.integer({
					label: 'Order',
					description: 'Lower numbers appear first.',
					defaultValue: 0,
				}),
				content: fields.markdoc({
					label: 'Case study',
					options: {
						image: {
							directory: 'src/assets/projects',
							publicPath: '../../assets/projects/',
						},
					},
				}),
			},
		}),
		blogs: collection({
			label: 'Blogs',
			slugField: 'title',
			path: 'src/content/blogs/*',
			format: { contentField: 'content' },
			entryLayout: 'content',
			columns: ['publishedDate', 'draft'],
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				excerpt: fields.text({
					label: 'Excerpt',
					description: 'Short summary shown in blog listings and search results.',
					multiline: true,
				}),
				coverImage: fields.image({
					label: 'Cover image',
					directory: 'src/assets/blogs',
					publicPath: '../../assets/blogs/',
				}),
				publishedDate: fields.date({
					label: 'Published date',
					defaultValue: { kind: 'today' },
					validation: { isRequired: true },
				}),
				author: fields.text({ label: 'Author' }),
				categories: fields.array(fields.text({ label: 'Category' }), {
					label: 'Categories',
					itemLabel: (props) => props.value,
				}),
				draft: fields.checkbox({
					label: 'Draft',
					description: 'Drafts are hidden from the built site.',
				}),
				content: fields.markdoc({
					label: 'Content',
					options: {
						image: {
							directory: 'src/assets/blogs',
							publicPath: '../../assets/blogs/',
						},
					},
				}),
			},
		}),
	},
});
