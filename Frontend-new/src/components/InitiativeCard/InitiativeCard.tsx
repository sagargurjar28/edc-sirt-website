import type { Initiative } from '../../types';
import styles from './InitiativeCard.module.css';

export default function InitiativeCard({ initiative }: { initiative: Initiative }) {
  return (
    <article className={styles.card}>
      <p className={styles.category}>{initiative.category}</p>
      <h3 className={styles.title}>{initiative.title}</h3>
      <p className={styles.summary}>{initiative.summary}</p>
      <a className={styles.link} href={initiative.href}>
        Learn more
        <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </article>
  );
}
