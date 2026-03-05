import fc from 'fast-check';
import { describe, expect, it, vi } from 'vitest';
import { createScrollObserver, fadeInUp, scaleIn, slideInLeft, slideInRight } from './animations.js';

function extractNumber(css, re) {
	const match = css.match(re);
	if (!match) return null;
	return Number(match[1]);
}

describe('animations', () => {
	it('fadeInUp uses defaults and produces bounded css', () => {
		const transition = fadeInUp({}, undefined);
		expect(transition.delay).toBe(0);
		expect(transition.duration).toBe(600);

		fc.assert(
			fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (t) => {
				const css = transition.css(t);
				const y = extractNumber(css, /translateY\(([-0-9.eE]+)px\)/);
				const opacity = extractNumber(css, /opacity:\s*([-0-9.eE]+)\s*;/);

				expect(y).not.toBeNull();
				expect(opacity).not.toBeNull();
				expect(y).toBeGreaterThanOrEqual(0);
				expect(y).toBeLessThanOrEqual(40);
				expect(opacity).toBeGreaterThanOrEqual(0);
				expect(opacity).toBeLessThanOrEqual(1);
			})
		);
	});

	it('slideInLeft and slideInRight bound translateX and opacity', () => {
		const left = slideInLeft({}, { delay: 10, duration: 20 });
		const right = slideInRight({}, { delay: 11, duration: 21 });
		expect(left.delay).toBe(10);
		expect(left.duration).toBe(20);
		expect(right.delay).toBe(11);
		expect(right.duration).toBe(21);

		fc.assert(
			fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (t) => {
				const leftCss = left.css(t);
				const rightCss = right.css(t);

				const leftX = extractNumber(leftCss, /translateX\(([-0-9.eE]+)px\)/);
				const rightX = extractNumber(rightCss, /translateX\(([-0-9.eE]+)px\)/);
				const leftOpacity = extractNumber(leftCss, /opacity:\s*([-0-9.eE]+)\s*;/);
				const rightOpacity = extractNumber(rightCss, /opacity:\s*([-0-9.eE]+)\s*;/);

				expect(leftX).not.toBeNull();
				expect(rightX).not.toBeNull();
				expect(leftOpacity).not.toBeNull();
				expect(rightOpacity).not.toBeNull();

				expect(leftX).toBeLessThanOrEqual(0);
				expect(leftX).toBeGreaterThanOrEqual(-50);
				expect(rightX).toBeGreaterThanOrEqual(0);
				expect(rightX).toBeLessThanOrEqual(50);
				expect(leftOpacity).toBeGreaterThanOrEqual(0);
				expect(leftOpacity).toBeLessThanOrEqual(1);
				expect(rightOpacity).toBeGreaterThanOrEqual(0);
				expect(rightOpacity).toBeLessThanOrEqual(1);
			})
		);
	});

	it('scaleIn binds scale and opacity', () => {
		const transition = scaleIn({}, undefined);
		expect(transition.delay).toBe(0);
		expect(transition.duration).toBe(400);

		fc.assert(
			fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (t) => {
				const css = transition.css(t);
				const scale = extractNumber(css, /scale\(([-0-9.eE]+)\)/);
				const opacity = extractNumber(css, /opacity:\s*([-0-9.eE]+)\s*;/);

				expect(scale).not.toBeNull();
				expect(opacity).not.toBeNull();

				expect(scale).toBeGreaterThanOrEqual(0.8);
				expect(scale).toBeLessThanOrEqual(1);
				expect(opacity).toBeGreaterThanOrEqual(0);
				expect(opacity).toBeLessThanOrEqual(1);
			})
		);
	});

	it('createScrollObserver merges default options', () => {
		const OriginalIntersectionObserver = globalThis.IntersectionObserver;

		class MockIntersectionObserver {
			constructor(callback, options) {
				this.callback = callback;
				this.options = options;
			}
		}

		globalThis.IntersectionObserver = MockIntersectionObserver;

		try {
			const callback = vi.fn();

			fc.assert(
				fc.property(
					fc.double({ min: 0, max: 1, noNaN: true }),
					fc.string(),
					(threshold, rootMargin) => {
						const observer = createScrollObserver(callback, { threshold, rootMargin });
						expect(observer).toBeInstanceOf(MockIntersectionObserver);
						expect(observer.callback).toBe(callback);
						expect(observer.options).toEqual({ threshold, rootMargin });
					}
				)
			);

			const observer = createScrollObserver(callback);
			expect(observer.options).toEqual({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
		} finally {
			globalThis.IntersectionObserver = OriginalIntersectionObserver;
		}
	});
});
