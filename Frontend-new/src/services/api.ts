import { aboutContent } from '../data/aboutContent';
import { blogs } from '../data/blogs';
import { contacts } from '../data/contacts';
import { events } from '../data/events';
import { footerData } from '../data/footerData';
import { gallery } from '../data/gallery';
import { initiatives } from '../data/initiatives';
import { headerContent, siteSettings } from '../data/siteSettings';
import { socials } from '../data/socials';
import { team } from '../data/team';
import type {
  AboutContent,
  Blog,
  ContactPerson,
  ContactSubmission,
  EventItem,
  EventRegistration,
  FooterData,
  GalleryItem,
  HeaderContent,
  Initiative,
  RegistrationField,
  SectionContentMap,
  SiteSettings,
  SocialLink,
  TeamMember,
} from '../types';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'https://focused-patience-production-1a18.up.railway.app';

function toImage(src: string, alt: string) {
  return { src, alt, width: 1200, height: 800, srcSet: src, sizes: '(max-width: 640px) 100vw, 50vw' };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeBlog(raw: any): Blog {
  return {
    id: String(raw.id ?? raw.slug),
    slug: String(raw.slug ?? raw.id),
    title: String(raw.title ?? 'Untitled article'),
    excerpt: String(raw.excerpt ?? raw.summary ?? ''),
    author: String(raw.author ?? 'EDC SIRT'),
    publishedAt: String(raw.published_at ?? raw.publishedAt ?? new Date().toISOString()),
    readingMinutes: Number(raw.reading_minutes ?? raw.readingMinutes ?? 5),
    category: String(raw.category ?? 'General'),
    featured: Boolean(raw.featured ?? false),
    image: raw.image ?? toImage(String(raw.image_url ?? ''), String(raw.image_alt ?? raw.title ?? 'Blog cover')),
    content: raw.content !== undefined ? String(raw.content) : undefined,
    href: `/blogs/${String(raw.slug ?? raw.id)}`,
  };
}

function normalizeEvent(raw: any): EventItem {
  return {
    id: String(raw.id ?? raw.slug),
    slug: String(raw.slug ?? raw.id),
    title: String(raw.title ?? 'Untitled event'),
    summary: String(raw.summary ?? raw.excerpt ?? ''),
    description: raw.description !== undefined ? String(raw.description) : undefined,
    startsAt: String(raw.starts_at ?? raw.startsAt ?? new Date().toISOString()),
    endsAt: raw.ends_at ?? raw.endsAt ? String(raw.ends_at ?? raw.endsAt) : undefined,
    location: String(raw.location ?? 'SIRT Campus, Bhopal'),
    category: String(raw.category ?? 'Event'),
    image: raw.image ?? toImage(String(raw.image_url ?? ''), String(raw.image_alt ?? raw.title ?? 'Event poster')),
    href: `/events/${String(raw.slug ?? raw.id)}`,
    registrationOpen: raw.registration_open ?? raw.registrationOpen ?? true,
    registrationFields: (raw.registration_fields ?? raw.registrationFields ?? []) as RegistrationField[],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function getJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { signal });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function getHeaderContent(signal?: AbortSignal): Promise<HeaderContent> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<HeaderContent>('/header', s);
  } catch {
    return headerContent;
  }
}

export async function getSiteSettings(signal?: AbortSignal): Promise<SiteSettings> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<SiteSettings>('/settings', s);
  } catch {
    return siteSettings;
  }
}

export async function getAboutContent(signal?: AbortSignal): Promise<AboutContent> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<AboutContent>('/about', s);
  } catch {
    return aboutContent;
  }
}

export async function getInitiatives(signal?: AbortSignal): Promise<Initiative[]> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<Initiative[]>('/initiatives', s);
  } catch {
    return initiatives;
  }
}

export async function getEvents(signal?: AbortSignal): Promise<EventItem[]> {
  const s = signal ?? new AbortController().signal;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await getJson<any[]>('/api/events', s);
    return raw.map(normalizeEvent);
  } catch {
    return events.map((e) => ({ ...e, registrationOpen: true, registrationFields: [] }));
  }
}

export async function getEventBySlug(slug: string, signal?: AbortSignal): Promise<EventItem> {
  const s = signal ?? new AbortController().signal;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await getJson<any>(`/api/events/${encodeURIComponent(slug)}`, s);
    return normalizeEvent(raw);
  } catch {
    const fallback = events.find((e) => e.slug === slug);
    if (!fallback) throw new Error('Event not found.');
    return { ...fallback, registrationOpen: true, registrationFields: [] };
  }
}

export async function getEventRegistrationFields(slug: string, signal?: AbortSignal): Promise<RegistrationField[]> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<RegistrationField[]>(`/api/events/${encodeURIComponent(slug)}/registration-fields`, s);
  } catch {
    return [];
  }
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  department: string;
  answers: Record<string, string>;
}

export async function registerForEvent(slug: string, payload: RegisterPayload): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${API_URL}/api/events/${encodeURIComponent(slug)}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = `Registration failed: ${res.status}`;
    try {
      const body = (await res.json()) as { detail?: string; message?: string };
      if (body.detail) detail = body.detail;
      else if (body.message) detail = body.message;
    } catch {
      /* keep default */
    }
    throw new Error(detail);
  }
  try {
    return (await res.json()) as { ok: boolean; message: string };
  } catch {
    return { ok: true, message: 'Registration received. See you at the event.' };
  }
}

export async function getBlogs(signal?: AbortSignal): Promise<Blog[]> {
  const s = signal ?? new AbortController().signal;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await getJson<any[]>('/api/blogs', s);
    return raw.map(normalizeBlog);
  } catch {
    return blogs;
  }
}

export async function getBlogBySlug(slug: string, signal?: AbortSignal): Promise<Blog> {
  const s = signal ?? new AbortController().signal;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await getJson<any>(`/api/blogs/${encodeURIComponent(slug)}`, s);
    return normalizeBlog(raw);
  } catch {
    const fallback = blogs.find((b) => b.slug === slug);
    if (!fallback) throw new Error('Article not found.');
    return fallback;
  }
}

export async function getGallery(signal?: AbortSignal): Promise<GalleryItem[]> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<GalleryItem[]>('/gallery', s);
  } catch {
    return gallery;
  }
}

export async function getTeam(signal?: AbortSignal): Promise<TeamMember[]> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<TeamMember[]>('/team', s);
  } catch {
    return team;
  }
}

export async function getContacts(signal?: AbortSignal): Promise<ContactPerson[]> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<ContactPerson[]>('/contacts', s);
  } catch {
    return contacts;
  }
}

export async function getSocials(signal?: AbortSignal): Promise<SocialLink[]> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<SocialLink[]>('/socials', s);
  } catch {
    return socials;
  }
}

export async function getFooterData(signal?: AbortSignal): Promise<FooterData> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<FooterData>('/footer', s);
  } catch {
    return footerData;
  }
}

export async function getSectionContent(signal?: AbortSignal): Promise<Partial<SectionContentMap>> {
  const s = signal ?? new AbortController().signal;
  try {
    return await getJson<Partial<SectionContentMap>>('/api/content', s);
  } catch {
    return {};
  }
}

export async function submitContact(payload: { name: string; email: string; message: string }): Promise<void> {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    // Contact endpoint is a future backend addition; fall back to mailto intent.
    throw new Error('Message could not be sent right now. Please email us directly.');
  }
}

export type { EventRegistration, ContactSubmission };
