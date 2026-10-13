import { Link } from 'react-router-dom';
import type { EventItem } from '../../types';
import styles from './EventCard.module.css';

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <article className={styles.card}>
      {event.image.src ? (
        <img src={event.image.src} alt={event.image.alt} loading="lazy" className={styles.image} />
      ) : null}
      <div className={styles.body}>
        <p className={styles.meta}>
          <span>{event.category}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={event.startsAt}>
            {new Date(event.startsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </time>
        </p>
        <h3 className={styles.title}>
          <Link to={event.href}>{event.title}</Link>
        </h3>
        <p className={styles.summary}>{event.summary}</p>
        <p className={styles.location}>{event.location}</p>
      </div>
    </article>
  );
}
