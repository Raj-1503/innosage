import { gsap } from 'gsap';

const html = document.documentElement;
const root = document.getElementById('page-curtain');
const TRANSITION_KEY = 'innosage:transition';
const LOADED_KEY = 'innosage:loaded';

const ease = 'expo.inOut';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

if (root) {
	html.dataset.curtainStarted = '1';
	const panels = root.querySelectorAll<HTMLElement>('[data-curtain-panel]');
	const trails = root.querySelectorAll<HTMLElement>('[data-curtain-trail]');
	const label = root.querySelector<HTMLElement>('[data-curtain-label]')!;
	const preload = root.querySelector<HTMLElement>('[data-curtain-preload]')!;

	const finish = () => {
		html.classList.remove('curtain-cover', 'curtain-preload');
		root.style.removeProperty('visibility');
		root.style.removeProperty('pointer-events');
		gsap.set([panels, trails, label], { clearProps: 'all' });
		window.dispatchEvent(new Event('curtain:done'));
		window.dispatchEvent(new Event('resize'));
	};

	// Panels and their orange trail leave upward, column by column, revealing the page.
	const reveal = () => {
		window.dispatchEvent(new Event('curtain:reveal'));
		gsap
			.timeline({ onComplete: finish })
			.set(trails, { y: 0, yPercent: 0 })
			.set(panels, { y: 0, yPercent: 0 })
			.to(panels, { yPercent: -100, duration: 0.9, ease, stagger: 0.06 }, 0)
			.to(trails, { yPercent: -100, duration: 0.9, ease, stagger: 0.06 }, 0.1);
	};

	const pageLoaded = new Promise<void>((resolve) => {
		if (document.readyState === 'complete') resolve();
		else addEventListener('load', () => resolve(), { once: true });
		setTimeout(resolve, 3500);
	});

	const runPreloader = () => {
		const square = preload.querySelector('[data-logo-part="square"]');
		const monogram = preload.querySelector('[data-logo-part="monogram"]');
		const triangle = preload.querySelector('[data-logo-part="triangle"]');
		const letters = preload.querySelectorAll('[data-logo-part="letter"]');
		const words = preload.querySelectorAll<HTMLElement>('[data-curtain-word]');
		const count = preload.querySelector<HTMLElement>('[data-curtain-count]')!;
		const progress = { value: 0 };
		const show = (value: number) => (count.textContent = String(Math.round(value)));

		gsap.set(words, { y: 0, yPercent: 100 });

		// The logo builds from its parts: red square, monogram, triangle, then the wordmark.
		const build = gsap
			.timeline()
			.from(square, { scale: 0, rotate: -90, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2)' }, 0.1)
			.from(monogram, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' }, 0.35)
			.from(triangle, { opacity: 0, x: 24, y: -24, duration: 0.6, ease: 'power3.out' }, 0.5)
			.from(letters, { opacity: 0, y: 28, duration: 0.5, ease: 'power3.out', stagger: 0.04 }, 0.55);

		words.forEach((word, index) => {
			build.to(word, { yPercent: 0, duration: 0.45, ease: 'power3.out' }, 0.45 + index * 0.6);
			if (index < words.length - 1)
				build.to(word, { yPercent: -100, duration: 0.45, ease: 'power3.in' }, 0.45 + (index + 1) * 0.6 - 0.1);
		});

		// The counter holds near the end until the page has really loaded.
		const toNinety = gsap.to(progress, {
			value: 90,
			duration: 1.9,
			ease: 'power2.inOut',
			onUpdate: () => show(progress.value),
		});

		Promise.all([pageLoaded, toNinety.then(), build.then()]).then(() => {
			gsap.to(progress, {
				value: 100,
				duration: 0.35,
				ease: 'power2.out',
				onUpdate: () => show(progress.value),
				onComplete: () => {
					try {
						sessionStorage.setItem(LOADED_KEY, '1');
					} catch {}
					gsap.to(preload, { opacity: 0, y: -24, duration: 0.4, ease: 'power2.in', onComplete: reveal });
				},
			});
		});
	};

	const runEntrance = () => {
		label.textContent = html.dataset.curtainLabel ?? '';
		gsap.set(label, { opacity: 1 });
		gsap.to(label, { opacity: 0, y: -16, duration: 0.3, delay: 0.15, ease: 'power2.in', onComplete: reveal });
	};

	if (html.classList.contains('curtain-preload')) runPreloader();
	else if (html.classList.contains('curtain-cover')) runEntrance();

	const labelFor = (path: string) => {
		const section = path.split('/').filter(Boolean)[0];
		if (!section) return 'Innosage';
		return section === 'blogs' ? 'Blogs' : section[0].toUpperCase() + section.slice(1);
	};

	// Sweep the columns over the page, then navigate. The next page starts covered and reveals itself.
	let leaving = false;
	const leave = (url: URL) => {
		leaving = true;
		if ('popover' in HTMLElement.prototype)
			document.querySelector<HTMLElement>('[popover]:popover-open')?.hidePopover();
		const text = labelFor(url.pathname);
		label.textContent = `■ ${text}`;
		root.style.visibility = 'visible';
		root.style.pointerEvents = 'auto';
		gsap
			.timeline({
				onComplete: () => {
					try {
						sessionStorage.setItem(TRANSITION_KEY, `■ ${text}`);
					} catch {}
					location.assign(url);
				},
			})
			.fromTo(trails, { y: 0, yPercent: 100 }, { yPercent: 0, duration: 0.7, ease, stagger: 0.05 }, 0)
			.fromTo(panels, { y: 0, yPercent: 100 }, { yPercent: 0, duration: 0.7, ease, stagger: 0.05 }, 0.1)
			.to(label, { opacity: 1, duration: 0.25 }, 0.6);
	};

	document.addEventListener('click', (event) => {
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		)
			return;
		const link = (event.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
		if (!link || link.target || link.hasAttribute('download') || leaving || reduced()) return;
		const url = new URL(link.href, location.href);
		if (url.origin !== location.origin || url.pathname.startsWith('/keystatic')) return;
		if (url.pathname === location.pathname) return;
		event.preventDefault();
		leave(url);
	});

	// Returning with the back button restores a frozen page, so clear any covering state.
	addEventListener('pageshow', (event) => {
		if (!event.persisted) return;
		leaving = false;
		gsap.killTweensOf([panels, trails, label]);
		finish();
	});
}
