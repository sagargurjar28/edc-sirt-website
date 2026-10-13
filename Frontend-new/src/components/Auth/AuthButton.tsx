import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Auth.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function AuthButton({ children, ...rest }: Props) {
  return (
    <button type="submit" className={styles.submit} {...rest}>
      {children}
    </button>
  );
}
