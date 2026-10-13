import type { Initiative } from '../types';

export const initiatives: Initiative[] = [
  {
    id: 'initiative-startup-weekend',
    slug: 'startup-weekend',
    title: 'Startup Weekend',
    summary: 'A 36-hour sprint from idea to prototype, with mentors, pitch practice, and real feedback from founders.',
    category: 'Build',
    href: '/#initiatives',
  },
  {
    id: 'initiative-incubation',
    slug: 'incubation-support',
    title: 'Incubation Support',
    summary: 'Desk space, design help, and weekly office hours to keep your project moving after the first spark.',
    category: 'Grow',
    href: '/#initiatives',
  },
  {
    id: 'initiative-mentorship',
    slug: 'founder-mentorship',
    title: 'Founder Mentorship',
    summary: 'Direct access to alumni founders and industry guides who review your deck, product, and go-to-market.',
    category: 'Learn',
    href: '/#initiatives',
  },
  {
    id: 'initiative-pitch-prime',
    slug: 'pitch-prime',
    title: 'Pitch Prime',
    summary: 'A monthly open mic for early pitches — five minutes, honest questions, and connections to what comes next.',
    category: 'Pitch',
    href: '/#initiatives',
  },
  {
    id: 'initiative-design-jam',
    slug: 'design-jam',
    title: 'Design Jam',
    summary: 'Hands-on sessions on product thinking, prototyping in Figma, and user research for first-time builders.',
    category: 'Design',
    href: '/#initiatives',
  },
  {
    id: 'initiative-fund-stack',
    slug: 'fund-stack',
    title: 'Fund Stack',
    summary: ' demystify grants, student funds, and early capital — with templates, timelines, and application support.',
    category: 'Capital',
    href: '/#initiatives',
  },
];
