from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import re

from .config import settings
from .database import Base, engine
from .routers import auth, blogs, events, students, uploads
from .utils import slugify, unique_slug

Base.metadata.create_all(bind=engine)

from sqlalchemy import text

with engine.begin() as conn:
    conn.execute(text("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content TEXT"))
    conn.execute(text("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500)"))

# One-time migration: regenerate any blog slug that is not URL-safe
# (lowercase a-z, 0-9, hyphens only). Idempotent — once all slugs match
# the regex, the second pass is a no-op.
_SLUG_OK = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')

with engine.begin() as conn:
    rows = conn.execute(text("SELECT id, slug, title FROM blogs ORDER BY id")).fetchall()
    seen: set[str] = set()
    used: dict[int, str] = {}
    for row in rows:
        current = row[1] or ''
        if _SLUG_OK.match(current):
            # already clean; keep it, but register so uniqueness works
            seen.add(current)
            used[row[0]] = current
    # second pass: fix the broken ones, avoiding collisions with kept slugs
    for row in rows:
        if row[0] in used:
            continue
        base = slugify(row[2] or '')
        final = unique_slug(base, seen)
        seen.add(final)
        conn.execute(text("UPDATE blogs SET slug = :s WHERE id = :i"),
                     {"s": final, "i": row[0]})

app = FastAPI(title="EDC SIRT API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(blogs.router)
app.include_router(events.router)
app.include_router(students.router)
app.include_router(uploads.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
