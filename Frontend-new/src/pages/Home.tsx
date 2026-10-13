import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Reveal from '../components/Reveal/Reveal';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import InitiativeCard from '../components/InitiativeCard/InitiativeCard';
import CircularGallery from '../components/CircularGallery/CircularGallery';
import CircularCarousel from '../components/CircularCarousel/CircularCarousel';
import ContactSection from '../components/ContactSection/ContactSection';
import { useContent } from '../hooks/useContent';
import { getAboutContent, getBlogs, getEvents, getFooterData, getInitiatives, getSiteSettings } from '../services/api';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { data: settings } = useContent(getSiteSettings);
  const { data: about } = useContent(getAboutContent);
  const { data: initiatives } = useContent(getInitiatives);
  const { data: events } = useContent(getEvents);
  const { data: blogs } = useContent(getBlogs);
  const { data: footer } = useContent(getFooterData);

  const openEvent = useCallback((item: { slug: string }) => navigate(`/events/${item.slug}`), [navigate]);
  const openBlog = useCallback((item: { slug: string }) => navigate(`/blogs/${item.slug}`), [navigate]);

  const hero = settings?.hero;
  const contact = footer?.contact;

  return (
    <>
      {hero ? (
        <Hero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          primaryLink={hero.primaryLink}
          secondaryLink={hero.secondaryLink}
        />
      ) : null}

      {about ? (
        <section id="about" className="section" aria-labelledby="home-about">
          <div className="container">
            <Reveal>
              <SectionHeading eyebrow={about.eyebrow} title={about.title} />
              <div className={styles.aboutGrid}>
                <div className={styles.aboutCard}>
                  <h3>{about.origin.title}</h3>
                  <p>{about.origin.body}</p>
                </div>
                <div className={styles.aboutCard}>
                  <h3>{about.vision.title}</h3>
                  <p>{about.vision.body}</p>
                </div>
                {about.image?.src ? <img src={about.image.src} alt={about.image.alt} loading="lazy" className={styles.aboutImage} /> : null}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section id="initiatives" className="section" aria-labelledby="home-initiatives">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="What we do" title="Initiatives that move ideas forward" />
            <div className={styles.grid3}>
              {(initiatives ?? []).map((item) => (
                <InitiativeCard key={item.id} initiative={item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="events" className="section" aria-labelledby="home-events">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="Gather" title="Upcoming events" description="Workshops, demo days, and founder meetups on campus." />
            <CircularGallery
              items={(events ?? []).map((e) => ({
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
              onItemClick={openEvent}
            />
          </Reveal>
        </div>
      </section>

      <section id="blogs" className="section" aria-labelledby="home-blogs">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="Learn" title="Stories from the community" description="Playbooks, founder notes, and event recaps." />
            <CircularCarousel
              items={(blogs ?? []).map((b) => ({ src: b.image.src, alt: b.image.alt, title: b.title, subtitle: b.excerpt, slug: b.slug }))}
              autoplay="drift"
              speed={12}
              preset="cylinder"
              draggable
              pauseOnHover
              onItemClick={openBlog}
            />
          </Reveal>
        </div>
      </section>

      <section id="contact" className="section" aria-labelledby="home-contact">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="Say hello" title="Get in touch" />
            {contact ? (
              <ContactSection address={contact.address} email={contact.email} phone={contact.phone} />
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="home-cta">
        <div className="container">
          <Reveal>
            <div className={styles.cta}>
              <h2 id="home-cta">Ready to start?</h2>
              <p>Join EDC SIRT for workshops, mentorship, and a community that ships. Bring an idea — leave with a plan.</p>
              <div className={styles.ctaActions}>
                <button type="button" className={styles.primary} onClick={() => navigate('/contact')}>
                  Join the community
                </button>
                <button type="button" className={styles.secondary} onClick={() => navigate('/events')}>
                  Browse events
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
