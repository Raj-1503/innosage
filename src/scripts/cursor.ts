import { gsap } from 'gsap';

const cursor = document.getElementById('custom-cursor');
const OFFSET = 30;

if (cursor && matchMedia('(min-width: 1280px) and (pointer: fine)').matches) {
	gsap.set(cursor, { autoAlpha: 0, x: innerWidth / 2, y: innerHeight / 2, scale: 1 });

	document.addEventListener('mousemove', (event) => {
		gsap.to(cursor, { autoAlpha: 1, duration: 0.2, overwrite: 'auto' });
		gsap.to(cursor, { x: event.clientX + OFFSET, y: event.clientY + OFFSET, duration: 0.4, ease: 'power3.out' });
	});

	document.addEventListener('mouseout', (event) => {
		if (!event.relatedTarget) gsap.to(cursor, { autoAlpha: 0, duration: 0.2 });
	});

	const bind = (selector: string, scale: number, className: string) => {
		document.querySelectorAll(selector).forEach((element) => {
			element.addEventListener('mouseenter', () => {
				gsap.to(cursor, { scale, duration: 0.2, ease: 'expo.out' });
				cursor.classList.add(className);
			});
			element.addEventListener('mouseleave', () => {
				gsap.to(cursor, { scale: 1, duration: 0.18, ease: 'expo.out' });
				cursor.classList.remove(className);
			});
		});
	};

	bind('[data-cursor="arrow"]', 6, 'cursor-active');
	bind('[data-cursor="scroll"]', 10, 'cursor-active1');
}
