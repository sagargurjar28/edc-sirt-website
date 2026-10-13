import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listRegistrations, registrationsToCsv } from '../../services/adminApi';
import type { EventRegistration } from '../../types';
import styles from './Admin.module.css';

export default function AdminEventRegistrations() {
  const { id = '' } = useParams();
  const [rows, setRows] = useState<EventRegistration[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setRows(await listRegistrations(id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load registrations.');
      }
    })();
  }, [id]);

  const exportCsv = () => {
    const csv = registrationsToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-${id}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h1>Registrations</h1>
        <button type="button" className={styles.primary} onClick={exportCsv} disabled={!rows.length}>
          Export CSV
        </button>
      </div>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      <table className={styles.table}>
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>College</th><th>Year</th><th>Department</th><th>Submitted</th><th>Custom answers</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>{r.college}</td>
              <td>{r.year}</td>
              <td>{r.department}</td>
              <td>{r.submittedAt}</td>
              <td>{JSON.stringify(r.answers)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && !error ? <p>No registrations yet.</p> : null}
    </div>
  );
}
