import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './CircularCarousel.module.css';

export interface CarouselItem {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  slug: string;
}

interface Props {
  items: CarouselItem[];
  autoplay?: 'drift' | 'off';
  speed?: number;
  preset?: 'cylinder' | 'flat';
  draggable?: boolean;
  pauseOnHover?: boolean;
  onItemClick?: (item: CarouselItem) => void;
}

/** Hand-rolled circular carousel (ReactBits-style API, zero new dependencies). */
export default function CircularCarousel({
  items,
  autoplay = 'drift',
  speed = 12,
  preset = 'cylinder',
  draggable = true,
  pauseOnHover = true,
  onItemClick,
}: Props) {
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(0);
  const drag = useRef<{ startX: number; startAngle: number } | null>(null);
  const track = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!items.length) return;
    const step = 360 / items.length;
    const idx = Math.round(((-angle % 360) + 360) % 360 / step) % items.length;
    setFocused(idx);
  }, [angle, items.length]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!draggable) return;
      drag.current = { startX: e.clientX, startAngle: angle };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [draggable, angle],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current || !track.current) return;
    const width = track.current.clientWidth || 1;
    const delta = ((e.clientX - drag.current.startX) / width) * 360;
    setAngle((drag.current.startAngle - delta + 360) % 360);
  }, []);

  const endDrag = useCallback(() => {
    drag.current = null;
  }, []);

  if (!items.length) return null;
  const step = 360 / items.length;
  const current = items[focused];

  return (
    <div>
      <div
        className={`${styles.stage} ${preset === 'cylinder' ? styles.cylinder : ''}`}
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
        role="listbox"
        aria-label="Featured articles carousel"
      >
        {items.map((item, i) => {
          const a = ((i * step + angle) * Math.PI) / 180;
          const x = Math.sin(a);
          const z = Math.cos(a);
          const depth = preset === 'cylinder' ? (z + 1) / 2 : 1;
          return (
            <button
              key={item.slug}
              type="button"
              role="option"
              aria-selected={i === focused}
              className={`${styles.card} ${i === focused ? styles.focused : ''}`}
              style={{
                transform: `translateX(${x * 220}px) scale(${0.72 + depth * 0.28})`,
                opacity: 0.45 + depth * 0.55,
                zIndex: Math.round(depth * 10),
              }}
              onClick={() => {
                setFocused(i);
                onItemClick?.(item);
              }}
            >
              {item.src ? <img src={item.src} alt={item.alt} loading="lazy" draggable={false} /> : null}
              <span className={styles.caption}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.subtitle}>{item.subtitle}</span>
              </span>
            </button>
          );
        })}
      </div>
      {current ? (
        <div className={styles.more}>
          <button type="button" className={styles.viewMore} onClick={() => onItemClick?.(current)}>
            View More — {current.title}
          </button>
        </div>
      ) : null}
    </div>
  );
}
