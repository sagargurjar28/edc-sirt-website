import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { useVisibilityPause } from './useVisibilityPause';

interface Props {
  scrollProgress?: number;
}

/**
 * Dependency-free 3D-look hero visual (project hard constraint forbids adding
 * three / @react-three/fiber / drei). Renders the EDC lightbulb + rocket
 * filament as layered SVG with requestAnimationFrame motion that mirrors the
 * specified three.js geometry: bulb sphere, wireframe rim, metallic base
 * cylinders, emissive filament, tilted rocket cone, and spark particles.
 */
export default function EDCHero3D({ scrollProgress = 0 }: Props) {
  const reduced = useReducedMotion();
  const { ref: wrapRef, visible } = useVisibilityPause<HTMLDivElement>();
  const [webglOk] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [bob, setBob] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [flare, setFlare] = useState(false);
  const [sparks, setSparks] = useState(() => Array.from({ length: 20 }, (_, i) => ({ seed: (i * 137.5) % 360, speed: 0.4 + (i % 5) * 0.15 })));

  useEffect(() => {
    if (reduced || !visible) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      setRotation((t * 0.12 * (180 / Math.PI)) % 360);
      setBob(Math.sin((t * Math.PI * 2) / 4) * 10);
      setSparks((prev) => prev.map((s) => ({ ...s, seed: (s.seed + s.speed * (hovered ? 2.4 : 1)) % 360 })));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, visible, hovered]);

  if (!webglOk || reduced) {
    return (
      <div className="edc3d-fallback">
        <img src="/edc-logo.svg" alt="EDC SIRT — Entrepreneurship Development Cell" width={320} height={152} />
      </div>
    );
  }

  const progress = Math.min(Math.max(scrollProgress, 0), 1);
  const scale = 1 - progress * 0.65;
  const opacity = 1 - progress;

  const flareTimer = useRef<number>(0);
  const handleClick = () => {
    setFlare(true);
    window.clearTimeout(flareTimer.current);
    flareTimer.current = window.setTimeout(() => setFlare(false), 200);
  };

  const glow = flare ? 2.0 : hovered ? 1.0 : 0.6;

  return (
    <div
      ref={wrapRef}
      className="edc3d"
      role="img"
      aria-label="Glowing lightbulb with a rocket filament, symbolising student ideas taking flight"
      style={{ transform: `scale(${scale})`, opacity }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <svg viewBox="0 0 400 460" width="100%" height="100%" aria-hidden="true">
        <defs>
          <radialGradient id="edc-bulb" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#e8a020" stopOpacity={0.35 * glow + 0.25} />
            <stop offset="55%" stopColor="#e8a020" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#e8a020" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="edc-fil" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e63946" stopOpacity={Math.min(1, 0.5 * glow + 0.4)} />
            <stop offset="100%" stopColor="#e63946" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={`translate(200 ${218 + bob}) rotate(${reduced ? 0 : rotation * 0.06})`}>
          <circle r="118" fill="url(#edc-bulb)" />
          <circle
            r="104"
            fill="rgba(232,160,32,0.06)"
            stroke="#e63946"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            transform={`rotate(${reduced ? 0 : rotation * 0.4})`}
          />
          <ellipse cx="0" cy="-118" rx="120" ry="26" fill="none" stroke="#e63946" strokeOpacity="0.08" strokeWidth="10" />
          <circle r="88" fill="rgba(232,160,32,0.10)" stroke="#f5c86b" strokeOpacity="0.5" strokeWidth="2" />
          <circle r="34" fill="url(#edc-fil)" />
          <circle r="15" fill="#e63946" opacity={Math.min(1, 0.55 + glow * 0.3)} />
          <g transform="rotate(45)">
            <polygon points="0,-34 12,8 0,1 -12,8" fill="#ffffff" opacity="0.95" />
            <rect x="-7" y="6" width="14" height="16" rx="3" fill="#f2f2f2" opacity="0.9" />
            <polygon points="-7,22 0,34 7,22" fill="#e63946" />
          </g>
          {sparks.map((s, i) => {
            const a = (s.seed * Math.PI) / 180;
            const r = 96 + (i % 4) * 9;
            return <circle key={i} cx={Math.cos(a) * r} cy={-Math.abs(Math.sin(a)) * r - 20} r={i % 3 === 0 ? 2.6 : 1.6} fill="#ffd27a" opacity={hovered ? 0.95 : 0.55} />;
          })}
          <g fill="#c9ccd1">
            <rect x="-30" y="96" width="60" height="15" rx="4" />
            <rect x="-26" y="113" width="52" height="15" rx="4" />
            <rect x="-22" y="130" width="44" height="15" rx="4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
