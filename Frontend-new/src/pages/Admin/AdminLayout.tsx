import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import styles from './Admin.module.css';

const TABS = [
  { to: '/admin/blogs', label: 'Blogs' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/content', label: 'Content' },
  { to: '/admin/submissions', label: 'Submissions' },
];

export default function AdminLayout() {
  const { me, loading, logout } = useAdminAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (loading) return <section className="container section"><p>Checking session…</p></section>;
  if (!me)
    return (
      <section className="container section" role="alert">
        <p>You need to log in to access the admin area.</p>
        <p><Link to="/admin/login">Go to login</Link></p>
      </section>
    );

  return (
    <div className="container section">
      <div className={styles.bar}>
        <p className={styles.who}>Signed in as {me.email}</p>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
        >
          Log out
        </button>
      </div>
      <nav aria-label="Admin sections" className={styles.tabs}>
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} aria-current={pathname.startsWith(t.to) ? 'page' : undefined} className={pathname.startsWith(t.to) ? styles.active : ''}>
            {t.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
