import { component, defineMarkdocConfig } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
	tags: {
		row: {
			render: component('./src/components/MediaRow.astro'),
			attributes: {
				layout: { type: String, matches: ['full', 'pair', 'wide-pair', 'trio', 'fan', 'natural'] },
			},
		},
		compare: {
			render: component('./src/components/ImageCompare.astro'),
		},
		caption: {
			render: component('./src/components/MediaCaption.astro'),
			attributes: {
				variant: { type: String, matches: ['band-start', 'band-center', 'half-start', 'tab'] },
				background: { type: String },
				color: { type: String },
			},
		},
		video: {
			render: component('./src/components/Video.astro'),
			selfClosing: true,
			attributes: {
				src: { type: String, required: true },
				audio: { type: Boolean },
			},
		},
		embed: {
			render: component('./src/components/Embed.astro'),
			selfClosing: true,
			attributes: {
				src: { type: String, required: true },
				title: { type: String, required: true },
			},
		},
	},
});
