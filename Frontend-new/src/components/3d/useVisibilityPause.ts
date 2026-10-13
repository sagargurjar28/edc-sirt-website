import { useEffect, useRef, useState } from 'react';

export function useVisibilityPause<T extends HTMLElement>(): { ref: React.RefObject<T | null>; visible: boolean } {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
