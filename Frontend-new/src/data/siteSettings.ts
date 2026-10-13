import type { HeaderContent, SiteSettings } from '../types';

export const siteSettings: SiteSettings = {
  name: 'EDC SIRT',
  shortName: 'EDC',
  institution: 'Sagar Institute of Research & Technology',
  description: 'Entrepreneurship Development Cell at SIRT — a community for student ideas, enterprise, and innovation.',
  logo: {
    src: '/edc-logo.svg',
    alt: 'Entrepreneurship Development Cell, Sagar Institute of Research & Technology',
    width: 725,
    height: 344,
  },
  hero: {
    eyebrow: 'Entrepreneurship Development Cell — SIRT Bhopal',
    title: 'Build what matters.',
    description: 'A student-led community turning curiosity into companies. Workshops, mentorship, and founder stories — designed so you can start now and learn fast.',
    primaryLink: { label: 'Explore Initiatives', href: '/#initiatives' },
    secondaryLink: { label: 'View Events', href: '/#events' },
  },
  contactEmail: 'edc@sirtbhopal.ac.in',
};

export const headerContent: HeaderContent = {
  name: 'EDC SIRT',
  logo: siteSettings.logo,
  navigation: {
    home: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/#about' },
      { label: 'Initiatives', href: '/#initiatives' },
      { label: 'Events', href: '/#events' },
      { label: 'Blogs', href: '/blogs' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Contact', href: '/contact' },
    ],
    inner: [
      { label: 'Home', href: '/' },
      { label: 'Blogs', href: '/blogs' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Contact', href: '/contact' },
    ],
    auth: [{ label: 'Home', href: '/' }],
  },
  joinLinks: [
    { label: 'Register', href: '/register' },
    { label: 'Login', href: '/login' },
  ],
};
