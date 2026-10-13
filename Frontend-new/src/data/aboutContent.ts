import type { AboutContent } from '../types';

export const aboutContent: AboutContent = {
  eyebrow: 'About EDC SIRT',
  title: 'Where student ideas find momentum.',
  origin: {
    title: 'Our Origin',
    body: 'EDC SIRT began as a small group of students who wanted a place to test ideas without waiting for permission. From borrowed classrooms to late-night builds, we turned that curiosity into a campus-wide movement for builders, designers, and first-time founders.',
  },
  vision: {
    title: 'Our Vision',
    body: 'We imagine a campus where every student can prototype, pitch, and ship. Through mentorship, funding guidance, and a tight community, we help you go from notebook sketch to working product — and from first customer to sustainable venture.',
  },
  image: {
    src: 'https://picsum.photos/seed/edc-about/800/1000',
    alt: 'Students collaborating in a workshop at EDC SIRT',
    width: 800,
    height: 1000,
    srcSet: 'https://picsum.photos/seed/edc-about/800/1000 1x, https://picsum.photos/seed/edc-about/1600/2000 2x',
    sizes: '(min-width: 1024px) 50vw, 100vw',
  },
};
