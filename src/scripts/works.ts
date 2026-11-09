import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.matchMedia().add('(min-width: 810px) and (prefers-reduced-motion: no-preference)', () => {
	// Cards slide in from both sides and meet over the statement.
	document.querySelectorAll<HTMLElement>('[data-slide-in]').forEach((card) => {
		gsap.from(card, {
			xPercent: card.dataset.slideIn === 'left' ? -70 : 70,
			ease: 'none',
			scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 35%', scrub: 0.6 },
		});
	});

	// Thumbnail rows drift gently in opposite directions.
	document.querySelectorAll<HTMLElement>('[data-strip]').forEach((strip) => {
		const distance = strip.dataset.strip === 'left' ? 40 : -40;
		gsap.fromTo(
			strip,
			{ x: -distance },
			{
				x: distance,
				ease: 'none',
				scrollTrigger: { trigger: strip, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
			},
		);
	});
});
