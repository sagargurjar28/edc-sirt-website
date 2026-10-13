import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard/BlogCard';
import { getBlogBySlug, getBlogs } from '../services/api';
import type { Blog } from '../types';
import styles from './BlogDetail.module.css';

export default function BlogDetail() {
  const { slug = '' } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const value = await getBlogBySlug(slug, controller.signal);
        if (controller.signal.aborted) return;
        setBlog(value);
        try {
          const all = await getBlogs(controller.signal);
          if (!controller.signal.aborted) setRelated(all.filter((b) => b.slug !== slug).slice(0, 3));
        } catch {
          /* related posts are optional */
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Article could not be loaded.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [slug]);

  if (loading) return <section className="container section"><p>Loading…</p></section>;
  if (error || !blog)
    return (
      <section className="container section" role="alert">
        <p>{error ?? 'Article not found.'}</p>
        <p><Link to="/blogs">Back to blogs</Link></p>
      </section>
    );

  return (
    <article className="container section">
      <p><Link to="/blogs">← All articles</Link></p>
      {blog.image.src ? <img src={blog.image.src} alt={blog.image.alt} className={styles.hero} /> : null}
      <p className={styles.meta}>
        {blog.category} · {new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {blog.readingMinutes} min read
      </p>
      <h1 className={styles.title}>{blog.title}</h1>
      <p className={styles.author}>By {blog.author}</p>
      {blog.content ? (
        <div className={styles.body}>
          {blog.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      ) : (
        <p className={styles.body}>{blog.excerpt}</p>
      )}
      {related.length ? (
        <section aria-label="Related posts" className={styles.related}>
          <h2>Related posts</h2>
          <div className={styles.grid}>
            {related.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
