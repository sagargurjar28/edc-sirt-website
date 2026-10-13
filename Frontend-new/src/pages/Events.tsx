import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularGallery from '../components/CircularGallery/CircularGallery';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import { useContent } from '../hooks/useContent';
import { getEvents } from '../services/api';

export default function Events() {
  const navigate = useNavigate();
  const { data, loading, error, retry } = useContent(getEvents);
  const open = useCallback((item: { slug: string }) => navigate(`/events/${item.slug}`), [navigate]);

  return (
    <div className="container section">
      <Reveal>
        <SectionHeading eyebrow="Gather" title="Events" description="Select a poster to view details and register." />
      </Reveal>
      {loading ? <p>Loading…</p> : null}
      {error ? (
        <div role="alert">
          <p>Events could not be loaded.</p>
          <button type="button" onClick={retry}>Try again</button>
        </div>
      ) : null}
      <Reveal>
        <CircularGallery
          items={(data ?? []).map((e) => ({
            src: e.image.src,
            alt: e.image.alt,
            title: e.title,
            date: new Date(e.startsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            slug: e.slug,
          }))}
          preset="orbit"
          autoplay="drift"
          speed={10}
          draggable
          onItemClick={open}
        />
      </Reveal>
    </div>
  );
}
