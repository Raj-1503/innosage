// Film grain: a darkening layer that shows on white and a lightening layer that shows on navy.
const TILE_SIZE = 256;
const TILE_COUNT = 6;
const FPS = 12;

interface Layer {
	id: string;
	scale: number;
	drift: { x: number; y: number };
	noise: { strength: number; meanShift: number; grayBias: number; colorJitter: number };
}

const layers: Layer[] = [
	{ id: 'grainMultiply', scale: 1.25, drift: { x: 0.2, y: 0.15 }, noise: { strength: 46, meanShift: -34, grayBias: 0.9, colorJitter: 10 } },
	{ id: 'grainScreen', scale: 1.5, drift: { x: 0.25, y: 0.22 }, noise: { strength: 24, meanShift: 18, grayBias: 0.9, colorJitter: 10 } },
];

const dpr = Math.max(1, Math.min(3, devicePixelRatio || 1));
const size = TILE_SIZE * dpr;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

function makeTile({ strength, meanShift, grayBias, colorJitter }: Layer['noise']) {
	const tile = document.createElement('canvas');
	tile.width = tile.height = size;
	const context = tile.getContext('2d')!;
	const image = context.createImageData(size, size);
	const data = image.data;
	for (let i = 0; i < data.length; i += 4) {
		const base = 128 + meanShift + (Math.random() * 2 - 1) * strength;
		if (Math.random() < grayBias) {
			data[i] = data[i + 1] = data[i + 2] = base;
		} else {
			data[i] = base + colorJitter;
			data[i + 1] = base - colorJitter;
			data[i + 2] = base + (Math.random() < 0.5 ? -1 : 1) * colorJitter * 0.6;
		}
		data[i + 3] = 255;
	}
	context.putImageData(image, 0, 0);
	return tile;
}

function paint({ id, scale, drift, noise }: Layer) {
	const canvas = document.getElementById(id) as HTMLCanvasElement | null;
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;

	// A short pool of tiles gives the same shimmer as regenerating noise every frame, at far less CPU.
	const patterns = Array.from({ length: still ? 1 : TILE_COUNT }, () => context.createPattern(makeTile(noise), 'repeat')!);
	let width = 0;
	let height = 0;
	let offsetX = 0;
	let offsetY = 0;
	let frame = 0;
	let last = 0;

	const draw = () => {
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, width, height);
		context.translate(-offsetX, -offsetY);
		context.scale(scale, scale);
		context.fillStyle = patterns[frame % patterns.length];
		context.fillRect(0, 0, (width + size) / scale, (height + size) / scale);
	};

	const resize = () => {
		width = canvas.width = Math.ceil(innerWidth * dpr);
		height = canvas.height = Math.ceil(innerHeight * dpr);
		draw();
	};

	const tick = (time: number) => {
		if (time - last >= 1000 / FPS) {
			offsetX = (offsetX + drift.x) % size;
			offsetY = (offsetY + drift.y) % size;
			frame += 1;
			last = time;
			draw();
		}
		requestAnimationFrame(tick);
	};

	resize();
	addEventListener('resize', resize, { passive: true });
	if (!still) requestAnimationFrame(tick);
}

layers.forEach(paint);
