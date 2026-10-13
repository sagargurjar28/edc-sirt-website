import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import TeamCard from '../components/TeamCard/TeamCard';
import { useContent } from '../hooks/useContent';
import { getTeam } from '../services/api';
import styles from './Team.module.css';

export default function Team() {
  const { data, loading, error, retry } = useContent(getTeam);

  return (
    <div className="container section">
      <Reveal>
        <SectionHeading eyebrow="People" title="Team" description="The students and mentors building EDC SIRT." />
      </Reveal>
      {loading ? <p>Loading…</p> : null}
      {error ? (
        <div role="alert">
          <p>Team could not be loaded.</p>
          <button type="button" onClick={retry}>Try again</button>
        </div>
      ) : null}
      <div className={styles.grid}>
        {(data ?? []).map((m) => (
          <TeamCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}
