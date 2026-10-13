import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { NavigationItem } from '../../types';

interface Props {
  open: boolean;
  links: NavigationItem[];
  onToggle: () => void;
  onClose: () => void;
}

export default function JoinUsMenu({ open, links, onToggle, onClose }: Props) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  return (
    <div className="edc-join" ref={wrap}>
      <button type="button" className="edc-join__toggle" aria-expanded={open} aria-haspopup="menu" onClick={onToggle}>
        Join Us
        <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <ul className="edc-join__menu" role="menu">
          {links.map((link) => (
            <li key={link.label} role="none">
              <Link role="menuitem" to={link.href} onClick={onClose}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
