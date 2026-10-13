import { Link } from 'react-router-dom';
import ContactSection from '../components/ContactSection/ContactSection';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import TeamCard from '../components/TeamCard/TeamCard';
import { useContent } from '../hooks/useContent';
import { getFooterData, getTeam } from '../services/api';
import styles from './Contact.module.css';

export default function Contact() {
  const { data: footer } = useContent(getFooterData);
  const { data: team } = useContent(getTeam);
  const contact = footer?.contact;

  return (
    <div className="container section">
      <Reveal>
        <SectionHeading eyebrow="Say hello" title="Contact" description="Reach out for collaborations, sponsorships, or joining the team." />
      </Reveal>
      {contact ? (
        <ContactSection address={contact.address} email={contact.email} phone={contact.phone} />
      ) : (
        <p>Loading contact details…</p>
      )}
      <section aria-labelledby="contact-team" className={styles.team}>
        <div className={styles.teamHead}>
          <h2 id="contact-team">Meet the team</h2>
          <Link to="/team">View all →</Link>
        </div>
        <div className={styles.grid}>
          {(team ?? []).slice(0, 4).map((m) => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
