import { useLayoutEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import SocialRail from './components/SocialRail/SocialRail';
import ErrorBoundary from './components/ErrorBoundary';
import { useContent } from './hooks/useContent';
import { getFooterData, getHeaderContent, getSocials } from './services/api';
import Home from './pages/Home';
import About from './pages/About';
import Initiatives from './pages/Initiatives';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Team from './pages/Team';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminBlogs from './pages/Admin/AdminBlogs';
import AdminEvents from './pages/Admin/AdminEvents';
import AdminEventRegistrations from './pages/Admin/AdminEventRegistrations';
import AdminContent from './pages/Admin/AdminContent';

export default function App() {
  const { pathname, hash, key } = useLocation();
  const { data: header, error, retry } = useContent(getHeaderContent);
  const { data: footer } = useContent(getFooterData);
  const { data: socials } = useContent(getSocials);

  useLayoutEffect(() => {
    const names: Record<string, string> = {
      '/': 'Home',
      '/about': 'About',
      '/initiatives': 'Initiatives',
      '/events': 'Events',
      '/blogs': 'Blogs',
      '/gallery': 'Gallery',
      '/contact': 'Contact',
      '/team': 'Team',
      '/admin/login': 'Admin Login',
    };
    document.title = `${names[pathname] ?? 'Page'} | EDC SIRT`;
    const frame = window.requestAnimationFrame(() => {
      let anchor = '';
      try {
        anchor = decodeURIComponent(hash.slice(1));
      } catch {
        anchor = '';
      }
      const target = anchor ? document.getElementById(anchor) : null;
      if (target) {
        target.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo(0, 0);
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return (
    <ErrorBoundary>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {header && <Header key={pathname} content={header} />}
      {socials && pathname === '/' && <SocialRail links={socials} />}
      <main id="main-content" tabIndex={-1}>
        {error && (
          <div className="container section" role="alert">
            <p>Navigation could not be loaded.</p>
            <button type="button" onClick={retry}>Try again</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/blogs" replace />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/:id/registrations" element={<AdminEventRegistrations />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="submissions" element={<AdminContent />} />
          </Route>
          <Route
            path="*"
            element={
              <section className="container section">
                <h1>Page not found.</h1>
                <p><Link to="/">Return home</Link></p>
              </section>
            }
          />
        </Routes>
      </main>
      {footer && <Footer data={footer} />}
    </ErrorBoundary>
  );
}
