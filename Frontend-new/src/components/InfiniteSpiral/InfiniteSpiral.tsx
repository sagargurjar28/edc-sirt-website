import { useEffect, useState } from 'react';
import styles from './InfiniteSpiral.module.css';

export interface SpiralItem {
  src: string;
  alt: string;
  title: string;
  slug: string;
}

interface Props {
  items: SpiralItem[];
  speed?: number;
  direction?: 'up' | 'down';
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  verticalSpacing?: number;
  cardsPerTurn?: number;
  pauseOnHover?: boolean;
  onItemClick?: (item: SpiralItem) => void;
}

/** Hand-rolled infinite spiral gallery (ReactBits-style API, zero new dependencies). */
export default function InfiniteSpiral({
  items,
  speed = 0.5,
  direction = 'up',
  radius = 200,
  cardWidth = 160,
  cardHeight = 160,
  pauseOnHover = true,
  onItemClick,
}: Props) {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setOffset((o) => o + dt * speed * 60 * (direction === 'up' ? -1 : 1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, speed, direction]);

  if (!items.length) return null;

  return (
    <div
      className={styles.stage}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {items.map((item, i) => {
        const turns = 3;
        const total = items.length * turns;
        const y = (((i * 200 + offset) % (total * 1)) + total * 1) % (total * 1);
        const angle = (i / items.length) * Math.PI * 2 + offset / 300;
        const x = Math.cos(angle) * radius * 0.45;
        const scale = 0.7 + 0.3 * ((Math.sin(angle) + 1) / 2);
        return (
          <button
            key={`${item.slug}-${i}`}
            type="button"
            className={styles.card}
            style={{
              transform: `translate(${x}px, ${((y % items.length) - items.length / 2) * 2.2}px) scale(${scale})`,
              inlineSize: cardWidth,
              blockSize: cardHeight,
            }}
            onClick={() => onItemClick?.(item)}
            aria-label={`View ${item.title}`}
          >
            {item.src ? <img src={item.src} alt={item.alt} loading="lazy" /> : <span>{item.title}</span>}
          </button>
        );
      })}
    </div>
  );
}
