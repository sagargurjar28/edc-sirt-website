import { useEffect, useState } from 'react';
import { getSectionContentAdmin, listSubmissions, saveSectionContentAdmin } from '../../services/adminApi';
import type { ContactSubmission, SectionContentMap } from '../../types';
import styles from './Admin.module.css';

const SECTIONS: (keyof SectionContentMap)[] = ['hero', 'about', 'cta', 'contact'];

export default function AdminContent() {
  const [content, setContent] = useState<Partial<SectionContentMap>>({});
  const [section, setSection] = useState<keyof SectionContentMap>('hero');
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const value = await getSectionContentAdmin();
        setContent(value);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load content.');
      }
      try {
        setSubmissions(await listSubmissions());
      } catch {
        /* submissions endpoint is a future backend addition */
      }
    })();
  }, []);

  useEffect(() => {
    const current = (content[section] ?? {}) as Record<string, unknown>;
    setDraft(Object.fromEntries(Object.entries(current).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v ?? '')])));
  }, [content, section]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    try {
      await saveSectionContentAdmin(section, draft);
      setStatus(`${section} content saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    }
  };

  return (
    <div className={styles.wrap}>
      <h1>Content</h1>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      {status ? <p role="status">{status}</p> : null}
      <div className={styles.tabs} role="tablist" aria-label="Content sections">
        {SECTIONS.map((s) => (
          <button key={s} type="button" role="tab" aria-selected={section === s} className={section === s ? styles.active : ''} onClick={() => setSection(s)}>
            {s}
          </button>
        ))}
      </div>
      <form onSubmit={save} className={styles.form} aria-label={`Edit ${section} content`}>
        {Object.entries(draft).map(([k, v]) => (
          <label key={k}>
            {k}
            {v.length > 120 ? (
              <textarea rows={4} value={v} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} />
            ) : (
              <input value={v} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} />
            )}
          </label>
        ))}
        {!Object.keys(draft).length ? <p>No saved values yet for this section — enter values to create them.</p> : null}
        <button type="submit" className={styles.primary}>Save {section}</button>
      </form>

      <section aria-label="Form submissions" className={styles.subs}>
        <h2>Submissions</h2>
        {submissions.length ? (
          <table className={styles.table}>
            <thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Submitted</th></tr></thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.message}</td>
                  <td>{s.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No submissions recorded yet.</p>
        )}
      </section>
    </div>
  );
}
