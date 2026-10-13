import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EDCHero3D from '../3d/EDCHero3D';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  primaryLink: { label: string; href: string };
  secondaryLink: { label: string; href: string };
}

export default function Hero({ eyebrow, title, description, primaryLink, secondaryLink }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    if (!section || !visual) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.to(visual, {
      scale: 0.35,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { trigger: section, scrub: true, start: 'top top', end: 'bottom bottom' },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const go = (href: string) => {
    if (href.startsWith('/#')) {
      document.getElementById(href.slice(2))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (href.startsWith('#')) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.assign(href);
    }
  };

  return (
    <section className={styles.hero} ref={sectionRef} data-header-region aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="hero-title">{title}</h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={() => go(primaryLink.href)}>
              {primaryLink.label}
            </button>
            <button type="button" className={styles.secondary} onClick={() => go(secondaryLink.href)}>
              {secondaryLink.label}
            </button>
          </div>
        </div>
        <div className={styles.visual} ref={visualRef}>
          <EDCHero3D />
        </div>
      </div>
    </section>
  );
}
