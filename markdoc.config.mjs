import { component, defineMarkdocConfig } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
	tags: {
		video: {
			render: component('./src/components/Video.astro'),
			selfClosing: true,
			attributes: {
				src: { type: String, required: true },
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
