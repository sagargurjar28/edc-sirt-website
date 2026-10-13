import { Link } from 'react-router-dom';
import type { FooterData } from '../../types';
import styles from './Footer.module.css';

export default function Footer({ data }: { data: FooterData }) {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.identity}>{data.identity}</p>
          <p className={styles.description}>{data.description}</p>
        </div>
        <nav aria-label="Initiatives">
          <p className="eyebrow">Initiatives</p>
          <ul className={styles.list}>
            {data.initiatives.map((l) => (
              <li key={l.label}>
                <Link to={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Useful links">
          <p className="eyebrow">Explore</p>
          <ul className={styles.list}>
            {data.usefulLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow">Contact</p>
          <address className={styles.contact}>
            <span>{data.contact.address}</span>
            <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
            {data.contact.phone ? <a href={`tel:${data.contact.phone}`}>{data.contact.phone}</a> : null}
          </address>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>
          © {year} {data.copyrightHolder}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
