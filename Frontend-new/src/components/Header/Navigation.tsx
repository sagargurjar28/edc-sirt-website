import { Link } from 'react-router-dom';
import type { NavigationItem } from '../../types';

interface Props {
  items: NavigationItem[];
  onNavigate?: () => void;
  variant?: 'default' | 'measure';
}

export default function Navigation({ items, onNavigate, variant = 'default' }: Props) {
  return (
    <nav aria-label={variant === 'measure' ? undefined : 'Primary'} className="edc-nav">
      <ul>
        {items.map((item) =>
          item.href.startsWith('/#') || item.href.includes('#') ? (
            <li key={item.label}>
              <a href={item.href} onClick={onNavigate}>
                {item.label}
              </a>
            </li>
          ) : (
            <li key={item.label}>
              <Link to={item.href} onClick={onNavigate}>
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
