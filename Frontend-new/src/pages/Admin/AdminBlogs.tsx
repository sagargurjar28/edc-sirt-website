import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DateTimeField from '../../components/Admin/DateTimeField';
import ImageUploadField from '../../components/Admin/ImageUploadField';
import { createBlog, deleteBlog, listBlogs, updateBlog } from '../../services/adminApi';
import type { Blog } from '../../types';
import styles from './Admin.module.css';

const EMPTY = { title: '', slug: '', excerpt: '', author: '', category: 'General', reading_minutes: 5, featured: false, published: true, published_at: '', image_url: '', image_alt: '', content: '' };

export default function AdminBlogs() {
  const [rows, setRows] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string | number | boolean>>(EMPTY);
  const [showNew, setShowNew] = useState(false);

  const refresh = async () => {
    try {
      setRows(await listBlogs());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load blogs.');
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const set = (k: string, v: string | number | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing) await updateBlog(editing, form);
      else await createBlog(form);
      setEditing(null);
      setShowNew(false);
      setForm(EMPTY);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    }
  };

  const startEdit = (b: Blog) => {
    setEditing(b.id);
    setShowNew(true);
    setForm({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      author: b.author,
      category: b.category,
      reading_minutes: b.readingMinutes,
      featured: b.featured,
      published: true,
      published_at: b.publishedAt,
      image_url: b.image.src,
      image_alt: b.image.alt,
      content: b.content ?? '',
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h1>Blogs</h1>
        <button type="button" className={styles.primary} onClick={() => { setEditing(null); setForm(EMPTY); setShowNew((s) => !s); }}>
          {showNew ? 'Close' : 'New Blog'}
        </button>
      </div>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      {showNew ? (
        <form onSubmit={save} className={styles.form} aria-label={editing ? 'Edit blog' : 'New blog'}>
          {(['title', 'slug', 'excerpt', 'author', 'category'] as const).map((k) => (
            <label key={k}>{k}<input value={String(form[k])} onChange={(e) => set(k, e.target.value)} required={k === 'title' || k === 'slug'} /></label>
          ))}
          <div className={styles.row}>
            <label>reading_minutes<input type="number" value={Number(form.reading_minutes)} onChange={(e) => set('reading_minutes', Number(e.target.value))} /></label>
            <DateTimeField label="Published at" value={String(form.published_at)} onChange={(iso) => set('published_at', iso)} />
          </div>
          <ImageUploadField label="Blog image" value={String(form.image_url)} onChange={(url) => set('image_url', url)} />
          <div className={styles.row}>
            <label>image_alt<input value={String(form.image_alt)} onChange={(e) => set('image_alt', e.target.value)} /></label>
          </div>
          <label>content<textarea rows={8} value={String(form.content)} onChange={(e) => set('content', e.target.value)} /></label>
          <div className={styles.row}>
            <label className={styles.check}><input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => set('featured', e.target.checked)} /> featured</label>
            <label className={styles.check}><input type="checkbox" checked={Boolean(form.published)} onChange={(e) => set('published', e.target.checked)} /> published</label>
          </div>
          <button type="submit" className={styles.primary}>{editing ? 'Save changes' : 'Create blog'}</button>
        </form>
      ) : null}
      <table className={styles.table}>
        <thead><tr><th>Title</th><th>Slug</th><th>Author</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.slug}</td>
              <td>{b.author}</td>
              <td className={styles.actions}>
                <button type="button" onClick={() => startEdit(b)}>Edit</button>
                <button type="button" onClick={() => { void deleteBlog(b.id).then(refresh).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Delete failed.')); }}>Delete</button>
                <Link to={`/blogs/${b.slug}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
