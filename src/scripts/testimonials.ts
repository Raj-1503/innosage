import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector<HTMLElement>('[data-pin-section]');
const row = document.querySelector<HTMLElement>('[data-pin-row]');
const track = document.querySelector<HTMLElement>('[data-pin-track]');
const thumb = document.querySelector<HTMLElement>('[data-pin-thumb]');

if (section && row && track && thumb) {
	const media = gsap.matchMedia();

	media.add('(min-width: 810px) and (prefers-reduced-motion: no-preference)', () => {
		row.parentElement?.classList.add('pinned');
		const distance = () => row.scrollWidth - section.clientWidth + 2 * parseFloat(getComputedStyle(row.parentElement!).paddingLeft);

		gsap.to(row, {
			x: () => -distance(),
			ease: 'none',
			scrollTrigger: {
				trigger: section,
				start: 'top top',
				end: () => `+=${distance()}`,
				pin: true,
				scrub: 1,
				anticipatePin: 1,
				invalidateOnRefresh: true,
				onUpdate: (self) => gsap.set(thumb, { x: self.progress * (track.offsetWidth - thumb.offsetWidth) }),
			},
		});

		return () => row.parentElement?.classList.remove('pinned');
	});

	// Below the pin breakpoint the row scrolls natively, so the thumb follows that instead.
	row.parentElement?.addEventListener(
		'scroll',
		(event) => {
			const scroller = event.currentTarget as HTMLElement;
			const progress = scroller.scrollLeft / (scroller.scrollWidth - scroller.clientWidth || 1);
			gsap.set(thumb, { x: progress * (track.offsetWidth - thumb.offsetWidth) });
		},
		{ passive: true },
	);

	addEventListener('load', () => ScrollTrigger.refresh());
}
