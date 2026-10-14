import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_admin
from ..database import get_db

router = APIRouter(tags=["blogs"])


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "post"


def unique_slug(db: Session, base: str, exclude_id: int | None = None) -> str:
    candidate = base
    n = 1
    while True:
        q = select(models.Blog).where(models.Blog.slug == candidate)
        if exclude_id is not None:
            q = q.where(models.Blog.id != exclude_id)
        if db.execute(q).scalar_one_or_none() is None:
            return candidate
        n += 1
        candidate = f"{base}-{n}"


def blog_to_out(row: models.Blog) -> schemas.BlogOut:
    src = row.image_url or ""
    alt = row.image_alt or row.title
    published = row.published_at
    if published.tzinfo is None:
        published = published.replace(tzinfo=timezone.utc)
    return schemas.BlogOut(
        id=f"blog-{row.id}",
        slug=row.slug,
        title=row.title,
        excerpt=row.excerpt or "",
        author=row.author or "",
        publishedAt=published.isoformat(),
        readingMinutes=row.reading_minutes,
        category=row.category or "",
        featured=row.featured,
        image=schemas.ContentImage(
            src=src,
            alt=alt,
            width=800,
            height=520,
            srcSet=f"{src} 1x" if src else "",
            sizes="(min-width: 1024px) 33vw, 100vw",
        ),
        href="/blogs",
        content=row.content or None,
        linkedin_url=row.linkedin_url or None,
    )


def apply_blog_in(row: models.Blog, payload: schemas.BlogIn) -> None:
    row.title = payload.title
    row.excerpt = payload.excerpt or ""
    row.author = payload.author or ""
    row.category = payload.category or ""
    row.reading_minutes = payload.reading_minutes
    row.featured = payload.featured
    row.published = payload.published
    row.image_url = payload.image_url or ""
    row.image_alt = payload.image_alt or ""
    row.content = payload.content or None
    row.linkedin_url = payload.linkedin_url or None
    if payload.published_at is not None:
        dt = payload.published_at
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        row.published_at = dt


@router.get("/api/blogs", response_model=list[schemas.BlogOut])
def public_list_blogs(db: Session = Depends(get_db)):
    rows = (
        db.execute(
            select(models.Blog)
            .where(models.Blog.published.is_(True))
            .order_by(models.Blog.published_at.desc())
        )
        .scalars()
        .all()
    )
    return [blog_to_out(r) for r in rows]


@router.get("/api/blogs/{slug}", response_model=schemas.BlogOut)
def public_get_blog(slug: str, db: Session = Depends(get_db)):
    row = db.execute(
        select(models.Blog).where(models.Blog.slug == slug)
    ).scalar_one_or_none()
    if row is None or not row.published:
        raise HTTPException(status_code=404, detail="Article not found")
    return blog_to_out(row)


@router.get("/api/admin/blogs", response_model=list[schemas.BlogOut])
def admin_list_blogs(
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    rows = (
        db.execute(select(models.Blog).order_by(models.Blog.published_at.desc()))
        .scalars()
        .all()
    )
    return [blog_to_out(r) for r in rows]


@router.post(
    "/api/admin/blogs", response_model=schemas.BlogOut, status_code=status.HTTP_201_CREATED
)
def admin_create_blog(
    payload: schemas.BlogIn,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    base = payload.slug.strip() or slugify(payload.title)
    row = models.Blog(
        slug=unique_slug(db, base),
        published_at=datetime.now(timezone.utc),
        created_by=admin.id,
    )
    apply_blog_in(row, payload)
    db.add(row)
    db.commit()
    db.refresh(row)
    return blog_to_out(row)


@router.put("/api/admin/blogs/{blog_id}", response_model=schemas.BlogOut)
def admin_update_blog(
    blog_id: int,
    payload: schemas.BlogIn,
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    row = db.get(models.Blog, blog_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    base = payload.slug.strip() or row.slug
    if base != row.slug:
        row.slug = unique_slug(db, base, exclude_id=row.id)
    apply_blog_in(row, payload)
    db.commit()
    db.refresh(row)
    return blog_to_out(row)


@router.delete("/api/admin/blogs/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    row = db.get(models.Blog, blog_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    db.delete(row)
    db.commit()
    return None
