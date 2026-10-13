import { Link } from 'react-router-dom';
import type { Blog } from '../../types';
import styles from './BlogCard.module.css';

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className={styles.card}>
      {blog.image.src ? (
        <img src={blog.image.src} alt={blog.image.alt} loading="lazy" className={styles.image} />
      ) : null}
      <div className={styles.body}>
        <p className={styles.meta}>
          <span>{blog.category}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={blog.publishedAt}>
            {new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </time>
          <span aria-hidden="true"> · </span>
          <span>{blog.readingMinutes} min read</span>
        </p>
        <h3 className={styles.title}>
          <Link to={blog.href}>{blog.title}</Link>
        </h3>
        <p className={styles.excerpt}>{blog.excerpt}</p>
        <p className={styles.author}>By {blog.author}</p>
      </div>
    </article>
  );
}
