// Slide-up reveal, matching the timing the live site's sections use.
const SELECTOR = 'main :is(h1, h2, h3, h4, h5, h6, p, li, video, dl, [data-reveal])';
const IGNORE = '.marquee, [data-pin-row], [data-reveal] *';

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

	document.querySelectorAll(SELECTOR).forEach((element) => {
		if (element.matches(IGNORE) || element.closest('.marquee, [data-pin-row]')) return;
		element.classList.add('reveal');
		observer.observe(element);
	});
}
