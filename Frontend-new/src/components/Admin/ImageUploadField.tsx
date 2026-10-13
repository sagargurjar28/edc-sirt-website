import { useRef, useState } from 'react';
import { uploadImage } from '../../services/adminApi';
import styles from './ImageUploadField.module.css';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_WIDTH = 1600;

async function maybeResize(file: File): Promise<File | Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }
  if (bitmap.width <= MAX_WIDTH) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement('canvas');
  canvas.width = MAX_WIDTH;
  canvas.height = Math.max(1, Math.round((bitmap.height * MAX_WIDTH) / bitmap.width));
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
  return blob ?? file;
}

export default function ImageUploadField({ value, onChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file || uploading) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      window.alert('Image must be 5 MB or smaller.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const payload = await maybeResize(file);
      const uploaded = await uploadImage(payload);
      onChange(uploaded.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const openPicker = () => {
    if (!uploading) inputRef.current?.click();
  };

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label ?? 'Image'}</span>
      <div
        role="button"
        tabIndex={uploading ? -1 : 0}
        aria-disabled={uploading}
        aria-label="Upload image"
        className={dragging ? `${styles.dropzone} ${styles.dropzoneActive}` : styles.dropzone}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files[0]);
        }}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 16l-4-4-4 4" />
          <path d="M12 12v9" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
        <span className={styles.hint}>{uploading ? 'Uploading…' : 'Drag image here or click to browse'}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          disabled={uploading}
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      {value ? (
        <div className={styles.preview}>
          <img src={value} alt="Preview" />
          <button type="button" className={styles.removeBtn} onClick={() => onChange('')}>
            Remove image
          </button>
        </div>
      ) : null}
      <label className={styles.urlRow}>
        Or paste a URL directly
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      </label>
      <p className={styles.hint}>Uploaded images use /api/images/N. You can also paste any external image URL.</p>
    </div>
  );
}
