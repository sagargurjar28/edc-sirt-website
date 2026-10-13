import type { GalleryItem } from '../../types';
import styles from './GalleryCard.module.css';

interface Props {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
}

export default function GalleryCard({ item, onOpen }: Props) {
  return (
    <article className={styles.card}>
      <button type="button" className={styles.button} onClick={() => onOpen(item)} aria-label={`View ${item.title}`}>
        {item.image.src ? <img src={item.image.src} alt={item.image.alt} loading="lazy" className={styles.image} /> : null}
        <span className={styles.overlay}>
          <span className={styles.title}>{item.title}</span>
          <span className={styles.category}>{item.category}</span>
        </span>
      </button>
    </article>
  );
}
