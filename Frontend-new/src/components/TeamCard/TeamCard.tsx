import type { TeamMember } from '../../types';
import styles from './TeamCard.module.css';

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className={styles.card}>
      {member.photo.src ? (
        <img src={member.photo.src} alt={member.photo.alt} loading="lazy" className={styles.photo} />
      ) : null}
      <div className={styles.body}>
        <h3 className={styles.name}>{member.name}</h3>
        <p className={styles.role}>{member.role}</p>
        <p className={styles.department}>{member.department}</p>
        {member.email ? (
          <a className={styles.email} href={`mailto:${member.email}`}>
            {member.email}
          </a>
        ) : null}
      </div>
    </article>
  );
}
