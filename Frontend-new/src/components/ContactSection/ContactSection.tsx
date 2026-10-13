import { useState } from 'react';
import { submitContact } from '../../services/api';
import styles from './ContactSection.module.css';

interface Props {
  address: string;
  email: string;
  phone?: string;
  hours?: string;
}

export default function ContactSection({ address, email, phone, hours }: Props) {
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await submitContact({ name, email: from, message });
      setStatus({ kind: 'ok', text: 'Message sent. Our team will reach out shortly.' });
      setName('');
      setFrom('');
      setMessage('');
    } catch (err) {
      setStatus({ kind: 'err', text: err instanceof Error ? err.message : 'Message could not be sent.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.grid}>
      <div className={styles.info}>
        <div className={styles.card}>
          <p className="eyebrow">Visit</p>
          <p>{address}</p>
        </div>
        <div className={styles.card}>
          <p className="eyebrow">Email</p>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
        {phone ? (
          <div className={styles.card}>
            <p className="eyebrow">Phone</p>
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
        ) : null}
        {hours ? (
          <div className={styles.card}>
            <p className="eyebrow">Hours</p>
            <p>{hours}</p>
          </div>
        ) : null}
      </div>
      <form className={styles.form} onSubmit={onSubmit} aria-label="Contact form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Your full name" />
        </label>
        <label>
          Email
          <input type="email" value={from} onChange={(e) => setFrom(e.target.value)} required autoComplete="email" placeholder="you@college.edu" />
        </label>
        <label>
          Message
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="How can EDC SIRT help you?" />
        </label>
        {status ? (
          <p role={status.kind === 'err' ? 'alert' : 'status'} className={status.kind === 'err' ? styles.error : styles.success}>
            {status.text}
          </p>
        ) : null}
        <button type="submit" disabled={sending} className={styles.submit}>
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}
