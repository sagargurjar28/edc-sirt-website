import type { Blog, ContactSubmission, EventItem, EventRegistration, RegistrationField, SectionContentMap } from '../types';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'https://focused-patience-production-1a18.up.railway.app';
const TOKEN_KEY = 'edc_admin_token';

export class AuthError extends Error {
  constructor(message = 'Not authenticated') {
    super(message);
    this.name = 'AuthError';
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    throw new AuthError('Session expired. Please log in again.');
  }
  return res;
}

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed: ${res.status}`;
    try {
      const body = (await res.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      /* keep default */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface AdminMe {
  id: number;
  email: string;
  name: string;
}

export async function loginAdmin(email: string, password: string): Promise<{ access_token: string }> {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await readJson<{ access_token: string }>(res);
  setToken(data.access_token);
  return data;
}

export async function getMe(): Promise<AdminMe> {
  const res = await authFetch('/api/admin/me');
  return readJson<AdminMe>(res);
}

export async function listBlogs(): Promise<Blog[]> {
  const res = await authFetch('/api/admin/blogs');
  return readJson<Blog[]>(res);
}

export async function createBlog(payload: Record<string, unknown>): Promise<Blog> {
  const res = await authFetch('/api/admin/blogs', { method: 'POST', body: JSON.stringify(payload) });
  return readJson<Blog>(res);
}

export async function updateBlog(id: string, payload: Record<string, unknown>): Promise<Blog> {
  const numericId = id.replace(/^blog-/, '');
  const res = await authFetch(`/api/admin/blogs/${numericId}`, { method: 'PUT', body: JSON.stringify(payload) });
  return readJson<Blog>(res);
}

export async function deleteBlog(id: string): Promise<void> {
  const numericId = id.replace(/^blog-/, '');
  const res = await authFetch(`/api/admin/blogs/${numericId}`, { method: 'DELETE' });
  await readJson<void>(res);
}

export async function listEvents(): Promise<EventItem[]> {
  const res = await authFetch('/api/admin/events');
  return readJson<EventItem[]>(res);
}

export async function createEvent(payload: Record<string, unknown>): Promise<Event> {
  const res = await authFetch('/api/admin/events', { method: 'POST', body: JSON.stringify(payload) });
  return readJson<Event>(res);
}

export async function updateEvent(id: string, payload: Record<string, unknown>): Promise<Event> {
  const numericId = id.replace(/^event-/, '');
  const res = await authFetch(`/api/admin/events/${numericId}`, { method: 'PUT', body: JSON.stringify(payload) });
  return readJson<Event>(res);
}

export async function deleteEvent(id: string): Promise<void> {
  const numericId = id.replace(/^event-/, '');
  const res = await authFetch(`/api/admin/events/${numericId}`, { method: 'DELETE' });
  await readJson<void>(res);
}

type Event = EventItem;

export async function listRegistrations(eventId: string): Promise<EventRegistration[]> {
  const numericId = eventId.replace(/^event-/, '');
  const res = await authFetch(`/api/admin/events/${numericId}/registrations`);
  return readJson<EventRegistration[]>(res);
}

export async function listRegistrationFields(eventId: string): Promise<RegistrationField[]> {
  const numericId = eventId.replace(/^event-/, '');
  const res = await authFetch(`/api/admin/events/${numericId}/registration-fields`);
  return readJson<RegistrationField[]>(res);
}

export async function saveRegistrationFields(eventId: string, fields: RegistrationField[]): Promise<RegistrationField[]> {
  const numericId = eventId.replace(/^event-/, '');
  const res = await authFetch(`/api/admin/events/${numericId}/registration-fields`, {
    method: 'PUT',
    body: JSON.stringify({ fields }),
  });
  return readJson<RegistrationField[]>(res);
}

export async function getSectionContentAdmin(): Promise<Partial<SectionContentMap>> {
  const res = await authFetch('/api/admin/content');
  return readJson<Partial<SectionContentMap>>(res);
}

export async function saveSectionContentAdmin(section: keyof SectionContentMap, data: Record<string, unknown>): Promise<void> {
  const res = await authFetch(`/api/admin/content/${section}`, { method: 'PUT', body: JSON.stringify(data) });
  await readJson<void>(res);
}

export async function listSubmissions(): Promise<ContactSubmission[]> {
  const res = await authFetch('/api/admin/submissions');
  return readJson<ContactSubmission[]>(res);
}

export function registrationsToCsv(rows: EventRegistration[]): string {
  const header = ['name', 'email', 'phone', 'college', 'year', 'department', 'submitted_at', 'custom_answers'];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.name, r.email, r.phone, r.college, r.year, r.department, r.submittedAt, JSON.stringify(r.answers)]
      .map(escape)
      .join(','),
  );
  return [header.join(','), ...lines].join('\n');
}

export async function uploadImage(file: File | Blob): Promise<{ id: number; url: string }> {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_URL}/api/admin/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (res.status === 401) { clearToken(); throw new AuthError('Session expired'); }
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = (await res.json()) as { id: number; url: string };
  // Return an absolute URL so the value stored in image_url is directly usable
  return { id: data.id, url: `${API_URL}${data.url}` };
}
