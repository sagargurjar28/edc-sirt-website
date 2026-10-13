import styles from './SectionHeading.module.css';

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
}

export default function SectionHeading({ eyebrow, title, description, align = 'start' }: Props) {
  return (
    <div className={`${styles.wrap} ${align === 'center' ? styles.center : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
