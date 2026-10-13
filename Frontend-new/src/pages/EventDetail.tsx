import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EventRegistrationForm from '../components/EventRegistrationForm/EventRegistrationForm';
import { getEventBySlug, getEventRegistrationFields } from '../services/api';
import type { EventItem, RegistrationField } from '../types';
import styles from './EventDetail.module.css';

export default function EventDetail() {
  const { slug = '' } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [fields, setFields] = useState<RegistrationField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      const value = await getEventBySlug(slug, controller.signal);
      setEvent(value);
      try {
        const custom = await getEventRegistrationFields(slug, controller.signal);
        setFields(custom.length ? custom : (value.registrationFields ?? []));
      } catch {
        setFields(value.registrationFields ?? []);
      }
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Event could not be loaded.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <section className="container section"><p>Loading…</p></section>;
  if (error || !event)
    return (
      <section className="container section" role="alert">
        <p>{error ?? 'Event not found.'}</p>
        <p><Link to="/events">Back to events</Link></p>
      </section>
    );

  return (
    <div className="container section">
      <p><Link to="/events">← All events</Link></p>
      {event.image.src ? <img src={event.image.src} alt={event.image.alt} className={styles.banner} /> : null}
      <p className="eyebrow">{event.category}</p>
      <h1 className={styles.title}>{event.title}</h1>
      <dl className={styles.meta}>
        <div><dt>Date</dt><dd>{new Date(event.startsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
        <div><dt>Location</dt><dd>{event.location}</dd></div>
        {event.endsAt ? <div><dt>Ends</dt><dd>{new Date(event.endsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div> : null}
      </dl>
      {event.description ? <p className={styles.description}>{event.description}</p> : <p className={styles.description}>{event.summary}</p>}
      <h2 className={styles.registerTitle} id="register">Register</h2>
      <EventRegistrationForm slug={event.slug} customFields={fields} registrationOpen={event.registrationOpen ?? true} />
    </div>
  );
}
