import type { ReactNode } from 'react';
import styles from './Auth.module.css';

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className={`container section ${styles.page}`}>
      <div className={styles.split}>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.glow} />
          <img src="/edc-logo.svg" alt="" className={styles.logoRotating} />
        </div>
        <div className={styles.panel}>{children}</div>
      </div>
    </div>
  );
}
