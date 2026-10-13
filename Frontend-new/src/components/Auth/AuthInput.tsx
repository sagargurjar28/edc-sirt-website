import styles from './Auth.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export default function AuthInput({ label, id, ...rest }: Props) {
  return (
    <label className={styles.field} htmlFor={id}>
      {label}
      <input id={id} {...rest} />
    </label>
  );
}
