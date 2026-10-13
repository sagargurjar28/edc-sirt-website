import { useEffect, useRef } from 'react';
import type { GalleryItem } from '../../types';
import styles from './GalleryModal.module.css';

interface Props {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function GalleryModal({ item, onClose }: Props) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        ref={dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close image details">
          <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {item.image.src ? <img src={item.image.src} alt={item.image.alt} className={styles.image} /> : null}
        <div className={styles.body}>
          <h2 className={styles.title}>{item.title}</h2>
          <p className={styles.description}>{item.description}</p>
          <dl className={styles.meta}>
            <div>
              <dt>Category</dt>
              <dd>{item.category}</dd>
            </div>
            <div>
              <dt>Captured</dt>
              <dd>{item.capturedAt}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{item.location}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
