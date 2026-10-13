import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createEvent, deleteEvent, listEvents, updateEvent } from '../../services/adminApi';
import type { EventItem } from '../../types';
import styles from './Admin.module.css';

const EMPTY = { title: '', slug: '', summary: '', category: 'Event', location: 'SIRT Campus, Bhopal', starts_at: '', image_url: '', image_alt: '', published: true, registration_open: true };

export default function AdminEvents() {
  const [rows, setRows] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>(EMPTY);
  const [showNew, setShowNew] = useState(false);

  const refresh = async () => {
    try {
      setRows(await listEvents());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load events.');
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing) await updateEvent(editing, form);
      else await createEvent(form);
      setEditing(null);
      setShowNew(false);
      setForm(EMPTY);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    }
  };

  const startEdit = (ev: EventItem) => {
    setEditing(ev.id);
    setShowNew(true);
    setForm({
      title: ev.title,
      slug: ev.slug,
      summary: ev.summary,
      category: ev.category,
      location: ev.location,
      starts_at: ev.startsAt,
      image_url: ev.image.src,
      image_alt: ev.image.alt,
      published: true,
      registration_open: ev.registrationOpen ?? true,
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h1>Events</h1>
        <button type="button" className={styles.primary} onClick={() => { setEditing(null); setForm(EMPTY); setShowNew((s) => !s); }}>
          {showNew ? 'Close' : 'New Event'}
        </button>
      </div>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      {showNew ? (
        <form onSubmit={save} className={styles.form} aria-label={editing ? 'Edit event' : 'New event'}>
          {(['title', 'slug', 'summary', 'category', 'location', 'starts_at', 'image_url', 'image_alt'] as const).map((k) => (
            <label key={k}>{k}<input value={String(form[k])} onChange={(e) => set(k, e.target.value)} required={k === 'title' || k === 'slug'} /></label>
          ))}
          <div className={styles.row}>
            <label className={styles.check}><input type="checkbox" checked={Boolean(form.published)} onChange={(e) => set('published', e.target.checked)} /> published</label>
            <label className={styles.check}><input type="checkbox" checked={Boolean(form.registration_open)} onChange={(e) => set('registration_open', e.target.checked)} /> registration_open</label>
          </div>
          <button type="submit" className={styles.primary}>{editing ? 'Save changes' : 'Create event'}</button>
        </form>
      ) : null}
      <table className={styles.table}>
        <thead><tr><th>Title</th><th>Slug</th><th>Location</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.title}</td>
              <td>{ev.slug}</td>
              <td>{ev.location}</td>
              <td className={styles.actions}>
                <button type="button" onClick={() => startEdit(ev)}>Edit</button>
                <button type="button" onClick={() => { void deleteEvent(ev.id).then(refresh).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Delete failed.')); }}>Delete</button>
                <Link to={`/admin/events/${ev.id.replace(/^event-/, '')}/registrations`}>View Registrations</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
