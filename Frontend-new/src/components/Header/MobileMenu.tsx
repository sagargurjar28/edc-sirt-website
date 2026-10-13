import { useEffect, useRef, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import type { NavigationItem } from '../../types';

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
  items: NavigationItem[];
  joinLinks: NavigationItem[];
  name: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function MobileMenu({ id, open, onClose, items, joinLinks, name, triggerRef }: Props) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    dialog.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      triggerRef.current?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div className="edc-mobile__overlay" onClick={onClose}>
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={`${name} navigation`}
        className="edc-mobile__dialog"
        ref={dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="edc-mobile__close" onClick={onClose} aria-label="Close navigation">
          <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <ul className="edc-mobile__list">
          {items.map((item) => (
            <li key={item.label}>
              <Link to={item.href} onClick={onClose}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="edc-mobile__join">
          {joinLinks.map((link) => (
            <Link key={link.label} to={link.href} onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
