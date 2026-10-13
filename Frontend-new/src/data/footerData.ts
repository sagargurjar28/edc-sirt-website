import type { FooterData } from '../types';
import { socials } from './socials';

export const footerData: FooterData = {
  identity: 'EDC SIRT',
  description: 'Entrepreneurship Development Cell at Sagar Institute of Research & Technology — helping students turn curiosity into companies.',
  newsletter: {
    title: 'Stay in the loop',
    description: 'Monthly notes on workshops, founder visits, and student builds. No spam.',
  },
  initiatives: [
    { label: 'Startup Weekend', href: '/#initiatives' },
    { label: 'Incubation Support', href: '/#initiatives' },
    { label: 'Founder Mentorship', href: '/#initiatives' },
    { label: 'Pitch Prime', href: '/#initiatives' },
  ],
  usefulLinks: [
    { label: 'About Us', href: '/#about' },
    { label: 'Events', href: '/#events' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ],
  contact: {
    address: 'Sagar Institute of Research & Technology, Ayodhya Bypass Road, Bhopal, MP 462041',
    email: 'edc@sirtbhopal.ac.in',
    phone: '+91 755 123 4567',
  },
  socials,
  copyrightHolder: 'EDC SIRT',
};
