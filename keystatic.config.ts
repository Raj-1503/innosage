import { collection, config, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

const contentComponents = {
	video: block({
		label: 'Video',
		schema: {
			src: fields.text({
				label: 'Path',
				description: 'Put the file in public/videos, then enter its path, such as /videos/projects/tweed/clip.webm.',
				validation: { isRequired: true },
			}),
			audio: fields.checkbox({
				label: 'Sound',
				description: 'Show an unmute button. The video keeps its own proportions in a natural row.',
			}),
		},
	}),
	row: wrapper({
		label: 'Gallery row',
		description: 'Lays out the images and videos inside it.',
		schema: {
			layout: fields.select({
				label: 'Layout',
				defaultValue: 'full',
				options: [
					{ label: 'Full width', value: 'full' },
					{ label: 'Tall pair', value: 'pair' },
					{ label: 'Short pair', value: 'wide-pair' },
					{ label: 'Three across', value: 'trio' },
					{ label: 'Three across, tilted', value: 'fan' },
					{ label: 'Natural size', value: 'natural' },
				],
			}),
		},
	}),
	compare: wrapper({
		label: 'Before and after slider',
		description: 'Add two images. The first shows on the left of the slider.',
		schema: {},
	}),
	caption: wrapper({
		label: 'Caption over image',
		description: 'Place inside a gallery row, after the image.',
		schema: {
			variant: fields.select({
				label: 'Style',
				defaultValue: 'band-start',
				options: [
					{ label: 'Wide band, left', value: 'band-start' },
					{ label: 'Wide band, centered', value: 'band-center' },
					{ label: 'Half band, left', value: 'half-start' },
					{ label: 'Small tab, centered', value: 'tab' },
				],
			}),
			background: fields.text({ label: 'Background', description: 'Any CSS color, such as rgba(192, 57, 43, 0.55).' }),
			color: fields.text({ label: 'Text color', description: 'For example #ffffff.' }),
		},
	}),
	embed: block({
		label: 'YouTube embed',
		schema: {
			src: fields.url({
				label: 'Embed URL',
				description: 'For example https://www.youtube-nocookie.com/embed/VIDEO_ID.',
				validation: { isRequired: true },
			}),
			title: fields.text({ label: 'Title', validation: { isRequired: true } }),
		},
	}),
};

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
				seoTitle: fields.text({
					label: 'SEO title',
					description: 'Browser tab and search result title. Falls back to the title.',
				}),
				client: fields.text({ label: 'Client' }),
				year: fields.text({ label: 'Year' }),
				summary: fields.text({
					label: 'Summary',
					description: 'Short line shown on project cards.',
					multiline: true,
				}),
				tagline: fields.text({ label: 'Tagline', description: 'Main headline on the project page.' }),
				heroIntro: fields.text({
					label: 'Hero intro',
					description: 'Optional line under the tagline.',
					multiline: true,
				}),
				overview: fields.text({ label: 'Overview', multiline: true }),
				heroColor: fields.text({
					label: 'Hero color',
					description: 'Brand color behind the project page hero, as a hex value.',
				}),
				heroTextDark: fields.checkbox({
					label: 'Dark hero text',
					description: 'Use dark text and logo on a light hero color.',
				}),
				coverImage: fields.image({
					label: 'Cover image',
					description: 'Thumbnail shown on project cards.',
					directory: 'src/assets/projects',
					publicPath: '../../assets/projects/',
				}),
				heroImage: fields.image({
					label: 'Hero image',
					description: 'Large media at the top of the project page. Ignored if a hero video is set.',
					directory: 'src/assets/projects',
					publicPath: '../../assets/projects/',
				}),
				heroVideo: fields.file({
					label: 'Hero video',
					directory: 'public/videos/projects',
					publicPath: '/videos/projects/',
				}),
				heroVideoAudio: fields.checkbox({
					label: 'Hero video has sound',
					description: 'Show an unmute button and keep the video proportions.',
				}),
				hoverVideo: fields.file({
					label: 'Hover video',
					description: 'Optional preview played when hovering the project in the Works grid.',
					directory: 'public/videos/projects',
					publicPath: '/videos/projects/',
				}),
				disciplines: fields.array(fields.text({ label: 'Discipline' }), {
					label: 'Disciplines',
					description: 'Tags shown on project cards.',
					itemLabel: (props) => props.value,
				}),
				services: fields.array(fields.text({ label: 'Service' }), {
					label: 'Services',
					description: 'Listed on the project page.',
					itemLabel: (props) => props.value,
				}),
				testimonial: fields.object(
					{
						quote: fields.text({ label: 'Quote', multiline: true }),
						name: fields.text({ label: 'Name' }),
						role: fields.text({ label: 'Role' }),
					},
					{ label: 'Testimonial' },
				),
				featured: fields.checkbox({
					label: 'Featured',
					description: 'Show this project on the home page.',
				}),
				homeBlurb: fields.text({
					label: 'Home blurb',
					description: 'Short line on the home page card, for featured projects.',
				}),
				homeOrder: fields.integer({
					label: 'Home order',
					description: 'Position among featured projects on the home page.',
					defaultValue: 0,
				}),
				comingSoon: fields.checkbox({
					label: 'Coming soon',
					description: 'The case study is not finished yet.',
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
					components: contentComponents,
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
					components: contentComponents,
				}),
			},
		}),
	},
});
