import Reveal from '../components/Reveal/Reveal';
import { useContent } from '../hooks/useContent';
import { getAboutContent } from '../services/api';
import styles from './About.module.css';

export default function About() {
  const { data: about, loading, error, retry } = useContent(getAboutContent);

  if (loading) return <section className="container section"><p>Loading…</p></section>;
  if (error || !about)
    return (
      <section className="container section" role="alert">
        <p>About content could not be loaded.</p>
        <button type="button" onClick={retry}>Try again</button>
      </section>
    );

  return (
    <div className="container section">
      <Reveal>
        <p className="eyebrow">{about.eyebrow}</p>
        <h1 className={styles.title}>{about.title}</h1>
      </Reveal>
      <div className={styles.grid}>
        <Reveal>
          <article className={styles.card}>
            <h2>{about.origin.title}</h2>
            <p>{about.origin.body}</p>
          </article>
        </Reveal>
        <Reveal>
          <article className={styles.card}>
            <h2>{about.vision.title}</h2>
            <p>{about.vision.body}</p>
          </article>
        </Reveal>
      </div>
      {about.image?.src ? (
        <Reveal>
          <img src={about.image.src} alt={about.image.alt} className={styles.image} />
        </Reveal>
      ) : null}
      <Reveal>
        <blockquote className={styles.quote}>
          <p>“The best way to predict the future is to build it — and no one builds alone.”</p>
          <cite>— Founding team, EDC SIRT</cite>
        </blockquote>
      </Reveal>
    </div>
  );
}
