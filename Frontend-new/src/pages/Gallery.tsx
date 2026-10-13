import { useState } from 'react';
import GalleryModal from '../components/GalleryModal/GalleryModal';
import InfiniteSpiral from '../components/InfiniteSpiral/InfiniteSpiral';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import { useContent } from '../hooks/useContent';
import { getGallery } from '../services/api';
import type { GalleryItem } from '../types';

export default function Gallery() {
  const { data, loading, error, retry } = useContent(getGallery);
  const [open, setOpen] = useState<GalleryItem | null>(null);

  return (
    <div className="container section">
      <Reveal>
        <SectionHeading eyebrow="Moments" title="Gallery" description="Select any image to view full details." />
      </Reveal>
      {loading ? <p>Loading…</p> : null}
      {error ? (
        <div role="alert">
          <p>Gallery could not be loaded.</p>
          <button type="button" onClick={retry}>Try again</button>
        </div>
      ) : null}
      <InfiniteSpiral
        items={(data ?? []).map((g) => ({ src: g.image.src, alt: g.image.alt, title: g.title, slug: g.id }))}
        speed={0.5}
        direction="up"
        radius={200}
        cardWidth={160}
        cardHeight={160}
        pauseOnHover
        onItemClick={(item) => setOpen((data ?? []).find((g) => g.id === item.slug) ?? null)}
      />
      <GalleryModal item={open} onClose={() => setOpen(null)} />
    </div>
  );
}
