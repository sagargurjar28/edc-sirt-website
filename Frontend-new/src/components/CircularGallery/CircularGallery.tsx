import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './CircularGallery.module.css';

export interface GalleryOrbitItem {
  src: string;
  alt: string;
  title: string;
  date: string;
  slug: string;
}

interface Props {
  items: GalleryOrbitItem[];
  preset?: 'orbit' | 'flat';
  autoplay?: 'drift' | 'off';
  speed?: number;
  draggable?: boolean;
  onItemClick?: (item: GalleryOrbitItem) => void;
}

/** Hand-rolled orbit gallery for event posters (ReactBits-style API, zero new dependencies). */
export default function CircularGallery({
  items,
  preset = 'orbit',
  autoplay = 'drift',
  speed = 10,
  draggable = true,
  onItemClick,
}: Props) {
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);
  const drag = useRef<{ startX: number; startAngle: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoplay === 'off' || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAngle((a) => (a + dt * speed) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, paused, speed]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!draggable) return;
      drag.current = { startX: e.clientX, startAngle: angle };
    },
    [draggable, angle],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current || !stage.current) return;
    const w = stage.current.clientWidth || 1;
    const delta = ((e.clientX - drag.current.startX) / w) * 360;
    setAngle((drag.current.startAngle - delta + 360) % 360);
  }, []);

  if (!items.length) return null;
  const step = 360 / items.length;

  return (
    <div>
      <div
        className={styles.stage}
        ref={stage}
        role="listbox"
        aria-label="Event posters"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((item, i) => {
          const a = ((i * step + angle) * Math.PI) / 180;
          const x = Math.sin(a);
          const z = Math.cos(a);
          const depth = preset === 'orbit' ? (z + 1) / 2 : 1;
          return (
            <button
              key={item.slug}
              type="button"
              role="option"
              aria-selected={i === selected}
              className={`${styles.card} ${i === selected ? styles.selected : ''}`}
              style={{
                transform: `translateX(${x * 240}px) scale(${0.7 + depth * 0.3})`,
                opacity: 0.5 + depth * 0.5,
                zIndex: Math.round(depth * 10),
              }}
              onClick={() => {
                setSelected(i);
                onItemClick?.(item);
              }}
            >
              {item.src ? <img src={item.src} alt={item.alt} loading="lazy" draggable={false} /> : null}
              <span className={styles.caption}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.date}>{item.date}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles.dots} role="tablist" aria-label="Choose poster">
        {items.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={i === selected}
            aria-label={item.title}
            className={`${styles.dot} ${i === selected ? styles.active : ''}`}
            onClick={() => {
              setSelected(i);
              onItemClick?.(item);
            }}
          />
        ))}
      </div>
    </div>
  );
}
