// Slide-up reveal, matching the timing the live site's sections use.
const SELECTOR = 'main :is(h1, h2, h3, h4, h5, h6, p, li, video, dl, [data-reveal])';
const IGNORE = '.marquee, [data-pin-row], [data-reveal] *';

const start = () => {
	const elements = [...document.querySelectorAll(SELECTOR)].filter(
		(element) => !element.matches(IGNORE) && !element.closest('.marquee, [data-pin-row]'),
	);
	elements.forEach((element) => element.classList.add('reveal'));

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('in-view');
				observer.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -5% 0px' },
	);

	const observe = () => elements.forEach((element) => observer.observe(element));

	// First-screen elements wait for the preloader or page transition before revealing.
	if (document.documentElement.classList.contains('curtain-cover')) {
		addEventListener('curtain:reveal', observe, { once: true });
	} else {
		observe();
	}
};

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
	start();
}
