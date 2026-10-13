import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { HeaderContent } from '../../types';
import Navigation from './Navigation';
import JoinUsMenu from './JoinUsMenu';
import MobileMenu from './MobileMenu';
import './Header.css';

type OpenPanel = 'none' | 'join' | 'mobile';

export default function Header({ content }: { content: HeaderContent }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const items = isHome ? content.navigation.home : content.navigation.inner;
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<OpenPanel>('none');
  const menuButton = useRef<HTMLButtonElement>(null);
  const dialogId = useId();
  const closePanel = useCallback(() => setPanel('none'), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    closePanel();
  }, [pathname, closePanel]);

  return (
    <>
      <header className={`edc-header${scrolled ? ' is-scrolled' : ''}`} aria-label="Site header">
        <div className="edc-header__shell">
          <Link className="edc-header__logo" to="/" aria-label={`${content.name} — Home`} onClick={closePanel}>
            <img src="/edc-logo.svg" alt={content.logo.alt} width={content.logo.width} height={content.logo.height} />
          </Link>
          <div className="edc-header__desktop">
            <Navigation items={items} onNavigate={closePanel} />
          </div>
          <div className="edc-header__actions">
            <JoinUsMenu
              open={panel === 'join'}
              links={content.joinLinks}
              onToggle={() => setPanel((c) => (c === 'join' ? 'none' : 'join'))}
              onClose={closePanel}
            />
            <button
              className="edc-header__toggle"
              type="button"
              aria-label="Open navigation"
              aria-controls={dialogId}
              aria-expanded={panel === 'mobile'}
              aria-haspopup="dialog"
              ref={menuButton}
              onClick={() => setPanel('mobile')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu
        id={dialogId}
        open={panel === 'mobile'}
        onClose={closePanel}
        items={items}
        joinLinks={content.joinLinks}
        name={content.name}
        triggerRef={menuButton}
      />
    </>
  );
}
