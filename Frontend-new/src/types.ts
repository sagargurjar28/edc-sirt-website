export interface ContentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  srcSet: string;
  sizes: string;
}

export interface Initiative {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  href: string;
}

export interface RegistrationField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  category: string;
  image: ContentImage;
  href: string;
  registrationOpen?: boolean;
  registrationFields?: RegistrationField[];
}
export type Event = EventItem;

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  category: string;
  featured: boolean;
  image: ContentImage;
  href: string;
  content?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  capturedAt: string;
  location: string;
  image: ContentImage;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  photo: ContentImage;
  email?: string;
  socials?: SocialLink[];
}

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  email: string;
  photo: ContentImage;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'x' | 'linkedin' | 'facebook' | 'youtube';
  label: string;
  url: string;
}

export interface FooterData {
  identity: string;
  description: string;
  newsletter: { title: string; description: string };
  initiatives: { label: string; href: string }[];
  usefulLinks: { label: string; href: string }[];
  contact: { address: string; email: string; phone?: string };
  socials: SocialLink[];
  copyrightHolder: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  origin: { title: string; body: string };
  vision: { title: string; body: string };
  image?: ContentImage;
}

export interface SiteSettings {
  name: string;
  shortName: string;
  institution: string;
  description: string;
  logo: { src: string; alt: string; width: number; height: number };
  hero: { eyebrow: string; title: string; description: string; primaryLink: { label: string; href: string }; secondaryLink: { label: string; href: string } };
  contactEmail: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface HeaderContent {
  name: string;
  logo: SiteSettings['logo'];
  navigation: {
    home: NavigationItem[];
    inner: NavigationItem[];
    auth: NavigationItem[];
  };
  joinLinks: NavigationItem[];
}

export interface SectionContentMap {
  hero: { eyebrow: string; title: string; description: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
  about: { eyebrow: string; title: string; originTitle: string; originBody: string; visionTitle: string; visionBody: string; image: string };
  cta: { title: string; description: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
  contact: { address: string; email: string; phone: string; hours: string };
}

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  department: string;
  answers: Record<string, string>;
  submittedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface StudentAuthResponse {
  access_token: string;
  token_type: string;
  student: Student;
}
