import type { ContactPerson } from '../types';

function photo(seed: string, w = 400, h = 400): ContactPerson['photo'] {
  return {
    src: `https://picsum.photos/seed/${seed}/${w}/${h}`,
    alt: seed.replace(/-/g, ' '),
    width: w,
    height: h,
    srcSet: `https://picsum.photos/seed/${seed}/${w}/${h} 1x, https://picsum.photos/seed/${seed}/${w * 2}/${h * 2} 2x`,
    sizes: '(min-width: 640px) 33vw, 50vw',
  };
}

export const contacts: ContactPerson[] = [
  {
    id: 'contact-edc',
    name: 'EDC Helpdesk',
    role: 'General Enquiries',
    email: 'edc@sirtbhopal.ac.in',
    photo: photo('contact-helpdesk'),
  },
  {
    id: 'contact-incubation',
    name: 'Incubation Support',
    role: 'Incubation & Partnerships',
    email: 'incubation@sirtbhopal.ac.in',
    photo: photo('contact-incubation'),
  },
  {
    id: 'contact-events',
    name: 'Events Team',
    role: 'Events & Workshops',
    email: 'events@edc.sirt',
    photo: photo('contact-events'),
  },
];
