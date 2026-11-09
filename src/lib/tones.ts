// Full class strings so Tailwind's scanner can see them.
export const tones = {
	white: 'bg-white',
	navy: 'bg-navy text-white [--heading:#fff]',
	ice: 'bg-ice',
};

export type Tone = keyof typeof tones;
