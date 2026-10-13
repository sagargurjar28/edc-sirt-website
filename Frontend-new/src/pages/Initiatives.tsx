import InitiativeCard from '../components/InitiativeCard/InitiativeCard';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import { useContent } from '../hooks/useContent';
import { getInitiatives } from '../services/api';
import styles from './Initiatives.module.css';

export default function Initiatives() {
  const { data, loading, error, retry } = useContent(getInitiatives);

  return (
    <div className="container section">
      <Reveal>
        <SectionHeading eyebrow="What we do" title="Initiatives" description="Every initiative links back to the community hub on the home page." />
      </Reveal>
      {loading ? <p>Loading…</p> : null}
      {error ? (
        <div role="alert">
          <p>Initiatives could not be loaded.</p>
          <button type="button" onClick={retry}>Try again</button>
        </div>
      ) : null}
      <div className={styles.grid}>
        {(data ?? []).map((item) => (
          <InitiativeCard key={item.id} initiative={item} />
        ))}
      </div>
    </div>
  );
}
