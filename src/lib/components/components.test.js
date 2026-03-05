import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: false }));
vi.mock('$app/paths', () => ({ base: '/base' }));
vi.mock('svelte-i18n', async () => {
	const { readable, writable } = await import('svelte/store');
	const locale = writable('ko');
	const isLoading = writable(false);
	const _ = readable((key) => key);
	return { _, locale, isLoading, init: () => {}, register: () => {} };
});

import AboutSection from './AboutSection.svelte';
import EducationSection from './EducationSection.svelte';
import ExperienceSection from './ExperienceSection.svelte';
import Footer from './Footer.svelte';
import Header from './Header.svelte';
import LanguageSwitcher from './LanguageSwitcher.svelte';
import LoadingSpinner from './LoadingSpinner.svelte';
import ProjectsSection from './ProjectsSection.svelte';

describe('components', () => {
	it('Header renders translated headings and links', () => {
		render(Header);
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('site_title');
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('site_subtitle');
		expect(screen.getByText('wintrover@gmail.com')).toBeInTheDocument();
		expect(document.querySelectorAll('a[target="_blank"]').length).toBeGreaterThanOrEqual(3);
	});

	it('LanguageSwitcher toggles locale from ko to en', async () => {
		const { locale } = await import('svelte-i18n');
		locale.set('ko');
		const setSpy = vi.spyOn(locale, 'set');

		render(LanguageSwitcher);
		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('English');
		await fireEvent.click(button);
		expect(setSpy).toHaveBeenCalledWith('en');
	});

	it('LanguageSwitcher toggles locale from en to ko', async () => {
		const { locale } = await import('svelte-i18n');
		locale.set('en');
		const setSpy = vi.spyOn(locale, 'set');

		render(LanguageSwitcher);
		const button = screen.getByRole('button');
		expect(button).toHaveTextContent('한국어');
		await fireEvent.click(button);
		expect(setSpy).toHaveBeenCalledWith('ko');
	});

	it('AboutSection uses base path for image and renders HTML content', () => {
		render(AboutSection);
		const img = screen.getByAltText('Profile');
		expect(img.getAttribute('src')).toBe('/base/assets/images/profile.png');
		expect(document.querySelector('p')).toHaveTextContent('about_content');
	});

	it('ProjectsSection renders list, links, and separators', () => {
		render(ProjectsSection);
		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('section_title_projects');
		expect(screen.getByText('projects.cvfactory.title')).toBeInTheDocument();
		expect(screen.getByText('projects.deep_fake_detect_app.title')).toBeInTheDocument();
		expect(screen.getByText('projects.face_recognition_dating_app.title')).toBeInTheDocument();

		expect(document.querySelectorAll('.project-links a').length).toBe(5);
		expect(document.querySelectorAll('.border-weak').length).toBe(2);
		const logos = document.querySelectorAll('img.project-logo');
		expect(logos.length).toBe(3);
	});

	it('ExperienceSection renders list and separators', () => {
		render(ExperienceSection);
		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('section_title_experience');
		expect(screen.getByText('experience.focc_inc.title')).toBeInTheDocument();
		expect(screen.getByText('experience.insight_marketing_labs.title')).toBeInTheDocument();
		expect(screen.getByText('experience.vizcam.title')).toBeInTheDocument();
		expect(document.querySelectorAll('.border-weak').length).toBe(2);
	});

	it('EducationSection renders list and separators', () => {
		render(EducationSection);
		expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('section_title_education');
		expect(screen.getByText('education.intel_ai_for_future_workforce.title')).toBeInTheDocument();
		expect(screen.getByText('education.halla_university.title')).toBeInTheDocument();
		expect(document.querySelectorAll('.border-weak').length).toBe(1);
	});

	it('Footer renders translated message', () => {
		render(Footer);
		expect(screen.getByText('footer_thank_you')).toBeInTheDocument();
	});

	it('LoadingSpinner renders default and custom styles', () => {
		const { container: c1 } = render(LoadingSpinner);
		const spinner1 = c1.querySelector('.spinner');
		expect(spinner1.getAttribute('style')).toContain('width: 40px;');
		expect(spinner1.getAttribute('style')).toContain('height: 40px;');
		expect(screen.getByText('포트폴리오를 불러오는 중...')).toBeInTheDocument();

		const { container: c2 } = render(LoadingSpinner, { props: { size: '10px', color: 'red' } });
		const spinner2 = c2.querySelector('.spinner');
		expect(spinner2.getAttribute('style')).toContain('width: 10px;');
		expect(spinner2.getAttribute('style')).toContain('height: 10px;');
		expect(spinner2.getAttribute('style')).toContain('border-color: red transparent red transparent;');
	});
});
