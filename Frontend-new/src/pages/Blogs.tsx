import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularCarousel from '../components/CircularCarousel/CircularCarousel';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import { useContent } from '../hooks/useContent';
import { getBlogs } from '../services/api';

export default function Blogs() {
  const navigate = useNavigate();
  const { data, loading, error, retry } = useContent(getBlogs);
  const open = useCallback((item: { slug: string }) => navigate(`/blogs/${item.slug}`), [navigate]);

  return (
    <div className="container section">
      <Reveal>
        <SectionHeading eyebrow="Learn" title="Blogs" description="Select a card or press View More to read the focused article." />
      </Reveal>
      {loading ? <p>Loading…</p> : null}
      {error ? (
        <div role="alert">
          <p>Blogs could not be loaded.</p>
          <button type="button" onClick={retry}>Try again</button>
        </div>
      ) : null}
      <Reveal>
        <CircularCarousel
          items={(data ?? []).map((b) => ({ src: b.image.src, alt: b.image.alt, title: b.title, subtitle: b.excerpt, slug: b.slug }))}
          autoplay="drift"
          speed={12}
          preset="cylinder"
          draggable
          pauseOnHover
          onItemClick={open}
        />
      </Reveal>
    </div>
  );
}
