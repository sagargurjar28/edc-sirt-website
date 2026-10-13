import styles from './DateTimeField.module.css';

interface Props {
  value: string;
  onChange: (iso: string) => void;
  label: string;
}

function toLocalInput(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DateTimeField({ value, onChange, label }: Props) {
  return (
    <label className={styles.field}>
      {label}
      <input
        type="datetime-local"
        value={toLocalInput(value)}
        onChange={(e) => {
          if (!e.target.value) {
            onChange('');
            return;
          }
          const d = new Date(e.target.value);
          onChange(Number.isNaN(d.getTime()) ? '' : d.toISOString());
        }}
      />
    </label>
  );
}
