import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Reveal.css';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

export default function Reveal({ children, delay = 0, y = 30, as: Tag = 'div', className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(el, { clearProps: 'all' });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y]);

  const joined = ['reveal', className].filter(Boolean).join(' ');
  return React.createElement(
    Tag,
    { ref: ref as React.Ref<HTMLElement>, className: joined } as unknown as React.Attributes & { className: string },
    children,
  );
}
