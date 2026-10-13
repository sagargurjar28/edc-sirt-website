import { useState } from 'react';
import { registerForEvent, type RegisterPayload } from '../../services/api';
import type { RegistrationField } from '../../types';
import styles from './EventRegistrationForm.module.css';

interface Props {
  slug: string;
  customFields: RegistrationField[];
  registrationOpen: boolean;
}

const FIXED = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { name: 'college', label: 'College', type: 'text', autoComplete: 'organization' },
  { name: 'year', label: 'Year', type: 'text', autoComplete: 'off' },
  { name: 'department', label: 'Department', type: 'text', autoComplete: 'off' },
] as const;

export default function EventRegistrationForm({ slug, customFields, registrationOpen }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    const payload: RegisterPayload = {
      name: values.name ?? '',
      email: values.email ?? '',
      phone: values.phone ?? '',
      college: values.college ?? '',
      year: values.year ?? '',
      department: values.department ?? '',
      answers: Object.fromEntries(customFields.map((f) => [f.name, values[f.name] ?? ''])),
    };
    try {
      const res = await registerForEvent(slug, payload);
      setStatus({ kind: 'ok', text: res.message });
    } catch (err) {
      // Keep input on error per spec.
      setStatus({ kind: 'err', text: err instanceof Error ? err.message : 'Registration failed.' });
    } finally {
      setSending(false);
    }
  };

  if (!registrationOpen) {
    return <p className={styles.closed}>Registrations are currently closed for this event.</p>;
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} aria-label="Event registration form">
      {FIXED.map((f) => (
        <label key={f.name} className={styles.field}>
          {f.label}
          <input
            type={f.type}
            required
            autoComplete={f.autoComplete}
            value={values[f.name] ?? ''}
            onChange={(e) => set(f.name, e.target.value)}
            placeholder={f.label}
          />
        </label>
      ))}
      {customFields.map((f) => (
        <label key={f.id} className={styles.field}>
          {f.label}
          {f.type === 'textarea' ? (
            <textarea value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} required={f.required} rows={4} placeholder={f.placeholder ?? f.label} />
          ) : f.type === 'select' && f.options ? (
            <select value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} required={f.required}>
              <option value="">Select…</option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type === 'select' ? 'text' : f.type}
              value={values[f.name] ?? ''}
              onChange={(e) => set(f.name, e.target.value)}
              required={f.required}
              placeholder={f.placeholder ?? f.label}
            />
          )}
        </label>
      ))}
      {status ? (
        <p role={status.kind === 'err' ? 'alert' : 'status'} className={status.kind === 'err' ? styles.error : styles.success}>
          {status.text}
        </p>
      ) : null}
      <button type="submit" disabled={sending} className={styles.submit}>
        {sending ? 'Registering…' : 'Register Now'}
      </button>
    </form>
  );
}
