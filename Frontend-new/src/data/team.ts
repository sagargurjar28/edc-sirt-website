import type { TeamMember } from '../types';

function photo(seed: string, w = 400, h = 400): TeamMember['photo'] {
  return {
    src: `https://picsum.photos/seed/${seed}/${w}/${h}`,
    alt: seed.replace(/-/g, ' '),
    width: w,
    height: h,
    srcSet: `https://picsum.photos/seed/${seed}/${w}/${h} 1x, https://picsum.photos/seed/${seed}/${w * 2}/${h * 2} 2x`,
    sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  };
}

export const team: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Aarav Mehta',
    role: 'President',
    department: 'CSE',
    photo: photo('team-aarav'),
    email: 'president@edc.sirt',
    socials: [{ id: 'sl-aarav-li', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' }],
  },
  {
    id: 'team-02',
    name: 'Neha Sharma',
    role: 'Vice President',
    department: 'ECE',
    photo: photo('team-neha'),
    socials: [{ id: 'sl-neha-li', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' }],
  },
  {
    id: 'team-03',
    name: 'Rohan Das',
    role: 'Head of Technology',
    department: 'CSE',
    photo: photo('team-rohan'),
  },
  {
    id: 'team-04',
    name: 'Isha Verma',
    role: 'Head of Design',
    department: 'Design',
    photo: photo('team-isha'),
  },
  {
    id: 'team-05',
    name: 'Kabir Singh',
    role: 'Head of Operations',
    department: 'Mechanical',
    photo: photo('team-kabir'),
  },
  {
    id: 'team-06',
    name: 'Priya Patel',
    role: 'Head of Content',
    department: 'MBA',
    photo: photo('team-priya'),
  },
  {
    id: 'team-07',
    name: 'Aditya Rao',
    role: 'Head of Marketing',
    department: 'CSE',
    photo: photo('team-aditya'),
  },
  {
    id: 'team-08',
    name: 'Sana Khan',
    role: 'Head of Outreach',
    department: 'ECE',
    photo: photo('team-sana'),
  },
];
