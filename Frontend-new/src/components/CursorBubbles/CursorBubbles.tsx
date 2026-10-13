import { useEffect, useRef } from 'react';
import styles from './CursorBubbles.module.css';

const MAX_BUBBLES = 40;
const THROTTLE_MS = 24;

export default function CursorBubbles() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const layer = layerRef.current;
    if (!layer) return;

    let last = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - last < THROTTLE_MS) return;
      last = now;
      if (layer.childElementCount >= MAX_BUBBLES) return;
      const bubble = document.createElement('span');
      bubble.className = styles.bubble;
      const size = 6 + Math.random() * 4;
      bubble.style.inlineSize = `${size}px`;
      bubble.style.blockSize = `${size}px`;
      bubble.style.left = `${e.clientX}px`;
      bubble.style.top = `${e.clientY}px`;
      const remove = () => bubble.remove();
      bubble.addEventListener('animationend', remove, { once: true });
      layer.appendChild(bubble);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches)
  ) {
    return null;
  }

  return <div ref={layerRef} className={styles.layer} aria-hidden="true" />;
}
