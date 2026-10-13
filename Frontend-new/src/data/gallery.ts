import type { GalleryItem } from '../types';

function img(seed: string, w = 800, h = 600): GalleryItem['image'] {
  return {
    src: `https://picsum.photos/seed/${seed}/${w}/${h}`,
    alt: seed.replace(/-/g, ' '),
    width: w,
    height: h,
    srcSet: `https://picsum.photos/seed/${seed}/${w}/${h} 1x, https://picsum.photos/seed/${seed}/${w * 2}/${h * 2} 2x`,
    sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  };
}

export const gallery: GalleryItem[] = [
  {
    id: 'gallery-01',
    title: 'Inaugural Summit',
    description: 'Opening keynote at the E-Cell Summit with a full auditorium.',
    category: 'Summit',
    capturedAt: '2025-03-15',
    location: 'SIRT Auditorium',
    image: img('gallery-inaugural'),
  },
  {
    id: 'gallery-02',
    title: 'Build Club Workshop',
    description: 'Students prototyping together during a late-night build session.',
    category: 'Workshop',
    capturedAt: '2025-11-02',
    location: 'Innovation Lab',
    image: img('gallery-workshop'),
  },
  {
    id: 'gallery-03',
    title: 'Pitch Prime',
    description: 'A student pitching to mentors during the monthly open mic.',
    category: 'Pitch',
    capturedAt: '2025-10-18',
    location: 'Seminar Hall',
    image: img('gallery-pitch'),
  },
  {
    id: 'gallery-04',
    title: 'Design Crit',
    description: 'Detailed feedback on early Figma explorations and user flows.',
    category: 'Design',
    capturedAt: '2025-09-12',
    location: 'Design Studio',
    image: img('gallery-design-crit'),
  },
  {
    id: 'gallery-05',
    title: 'Team Huddle',
    description: 'Cross-functional teams aligning before Demo Day.',
    category: 'Team',
    capturedAt: '2025-12-01',
    location: 'Central Atrium',
    image: img('gallery-team-huddle'),
  },
  {
    id: 'gallery-06',
    title: 'Founder AMA',
    description: 'Alumni founders returning to share candid lessons and stories.',
    category: 'Talk',
    capturedAt: '2025-08-20',
    location: 'SIRT Auditorium',
    image: img('gallery-founder-ama'),
  },
  {
    id: 'gallery-07',
    title: 'Ideathon Finals',
    description: 'Final jury review during the Spring Ideathon closing ceremony.',
    category: 'Hackathon',
    capturedAt: '2025-04-10',
    location: 'Central Atrium',
    image: img('gallery-ideathon'),
  },
  {
    id: 'gallery-08',
    title: 'Mentor Office Hours',
    description: 'One-on-one guidance on product, pitch, and go-to-market.',
    category: 'Mentorship',
    capturedAt: '2025-11-20',
    location: 'Incubation Hub',
    image: img('gallery-mentor'),
  },
];
