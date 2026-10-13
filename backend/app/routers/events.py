import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_admin
from ..database import get_db

router = APIRouter(tags=["events"])


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "event"


def unique_slug(db: Session, base: str, exclude_id: int | None = None) -> str:
    candidate = base
    n = 1
    while True:
        q = select(models.Event).where(models.Event.slug == candidate)
        if exclude_id is not None:
            q = q.where(models.Event.id != exclude_id)
        if db.execute(q).scalar_one_or_none() is None:
            return candidate
        n += 1
        candidate = f"{base}-{n}"


def event_to_out(row: models.Event) -> schemas.EventOut:
    src = row.image_url or ""
    alt = row.image_alt or row.title
    starts = row.starts_at
    if starts.tzinfo is None:
        starts = starts.replace(tzinfo=timezone.utc)
    return schemas.EventOut(
        id=f"event-{row.id}",
        slug=row.slug,
        title=row.title,
        summary=row.summary or "",
        startsAt=starts.isoformat(),
        location=row.location or "",
        category=row.category or "",
        image=schemas.ContentImage(
            src=src,
            alt=alt,
            width=800,
            height=600,
            srcSet=f"{src} 1x" if src else "",
            sizes="(min-width: 1024px) 33vw, 100vw",
        ),
        href="/#events",
    )


def apply_event_in(row: models.Event, payload: schemas.EventIn) -> None:
    row.title = payload.title
    row.summary = payload.summary or ""
    row.category = payload.category or ""
    row.location = payload.location or ""
    row.published = payload.published
    row.image_url = payload.image_url or ""
    row.image_alt = payload.image_alt or ""
    if payload.starts_at is not None:
        dt = payload.starts_at
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        row.starts_at = dt


@router.get("/api/events", response_model=list[schemas.EventOut])
def public_list_events(db: Session = Depends(get_db)):
    rows = (
        db.execute(
            select(models.Event)
            .where(models.Event.published.is_(True))
            .order_by(models.Event.starts_at.asc())
        )
        .scalars()
        .all()
    )
    return [event_to_out(r) for r in rows]


def _get_published_event_or_404(db: Session, slug: str) -> models.Event:
    row = db.execute(
        select(models.Event).where(models.Event.slug == slug)
    ).scalar_one_or_none()
    if row is None or not row.published:
        raise HTTPException(status_code=404, detail="Event not found")
    return row


def field_to_out(row: models.RegistrationField) -> schemas.RegistrationFieldOut:
    return schemas.RegistrationFieldOut(
        id=f"field-{row.id}",
        name=row.name,
        label=row.label or row.name,
        type=row.type,
        required=row.required,
        options=list(row.options) if row.options else None,
        placeholder=row.placeholder or "",
    )


def registration_to_out(row: models.EventRegistration) -> schemas.EventRegistrationOut:
    submitted = row.submitted_at
    if submitted.tzinfo is None:
        submitted = submitted.replace(tzinfo=timezone.utc)
    return schemas.EventRegistrationOut(
        id=f"reg-{row.id}",
        eventId=f"event-{row.event_id}",
        name=row.name,
        email=row.email,
        phone=row.phone or "",
        college=row.college or "",
        year=row.year or "",
        department=row.department or "",
        answers=dict(row.answers) if row.answers else {},
        submittedAt=submitted.isoformat(),
    )


@router.get("/api/events/{slug}", response_model=schemas.EventOut)
def public_get_event(slug: str, db: Session = Depends(get_db)):
    return event_to_out(_get_published_event_or_404(db, slug))


@router.get("/api/events/{slug}/registration-fields", response_model=list[schemas.RegistrationFieldOut])
def public_list_registration_fields(slug: str, db: Session = Depends(get_db)):
    event = _get_published_event_or_404(db, slug)
    rows = (
        db.execute(
            select(models.RegistrationField)
            .where(models.RegistrationField.event_id == event.id)
            .order_by(models.RegistrationField.sort_order.asc(), models.RegistrationField.id.asc())
        )
        .scalars()
        .all()
    )
    return [field_to_out(r) for r in rows]


@router.post("/api/events/{slug}/register", status_code=status.HTTP_201_CREATED)
def public_register_for_event(slug: str, payload: schemas.EventRegisterIn, db: Session = Depends(get_db)):
    event = _get_published_event_or_404(db, slug)
    row = models.EventRegistration(
        event_id=event.id,
        name=payload.name.strip(),
        email=str(payload.email).strip().lower(),
        phone=payload.phone.strip(),
        college=payload.college.strip(),
        year=payload.year.strip(),
        department=payload.department.strip(),
        answers=dict(payload.answers or {}),
    )
    db.add(row)
    db.commit()
    return {"ok": True, "message": "Registration received. See you at the event."}


def _get_event_by_numeric_id(db: Session, event_id: str) -> models.Event:
    try:
        numeric = int(str(event_id).replace("event-", ""))
    except ValueError:
        raise HTTPException(status_code=404, detail="Event not found")
    row = db.get(models.Event, numeric)
    if row is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return row


@router.get("/api/admin/events/{event_id}/registrations", response_model=list[schemas.EventRegistrationOut])
def admin_list_registrations(
    event_id: str,
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    event = _get_event_by_numeric_id(db, event_id)
    rows = (
        db.execute(
            select(models.EventRegistration)
            .where(models.EventRegistration.event_id == event.id)
            .order_by(models.EventRegistration.submitted_at.desc())
        )
        .scalars()
        .all()
    )
    return [registration_to_out(r) for r in rows]


@router.get("/api/admin/events/{event_id}/registration-fields", response_model=list[schemas.RegistrationFieldOut])
def admin_list_registration_fields(
    event_id: str,
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    event = _get_event_by_numeric_id(db, event_id)
    rows = (
        db.execute(
            select(models.RegistrationField)
            .where(models.RegistrationField.event_id == event.id)
            .order_by(models.RegistrationField.sort_order.asc(), models.RegistrationField.id.asc())
        )
        .scalars()
        .all()
    )
    return [field_to_out(r) for r in rows]


@router.put("/api/admin/events/{event_id}/registration-fields", response_model=list[schemas.RegistrationFieldOut])
def admin_save_registration_fields(
    event_id: str,
    payload: schemas.RegistrationFieldsPayload,
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    event = _get_event_by_numeric_id(db, event_id)
    existing = (
        db.execute(
            select(models.RegistrationField).where(models.RegistrationField.event_id == event.id)
        )
        .scalars()
        .all()
    )
    for row in existing:
        db.delete(row)
    db.flush()
    saved: list[models.RegistrationField] = []
    for index, field in enumerate(payload.fields):
        row = models.RegistrationField(
            event_id=event.id,
            name=field.name.strip(),
            label=field.label.strip() or field.name.strip(),
            type=field.type.strip() or "text",
            required=field.required,
            options=list(field.options) if field.options else None,
            placeholder=field.placeholder.strip(),
            sort_order=index,
        )
        db.add(row)
        saved.append(row)
    db.commit()
    for row in saved:
        db.refresh(row)
    return [field_to_out(r) for r in saved]


@router.get("/api/admin/events", response_model=list[schemas.EventOut])
def admin_list_events(
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    rows = (
        db.execute(select(models.Event).order_by(models.Event.starts_at.desc()))
        .scalars()
        .all()
    )
    return [event_to_out(r) for r in rows]


@router.post(
    "/api/admin/events",
    response_model=schemas.EventOut,
    status_code=status.HTTP_201_CREATED,
)
def admin_create_event(
    payload: schemas.EventIn,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    base = payload.slug.strip() or slugify(payload.title)
    row = models.Event(
        slug=unique_slug(db, base),
        starts_at=datetime.now(timezone.utc),
        created_by=admin.id,
    )
    apply_event_in(row, payload)
    db.add(row)
    db.commit()
    db.refresh(row)
    return event_to_out(row)


@router.put("/api/admin/events/{event_id}", response_model=schemas.EventOut)
def admin_update_event(
    event_id: int,
    payload: schemas.EventIn,
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    row = db.get(models.Event, event_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Event not found")
    base = payload.slug.strip() or row.slug
    if base != row.slug:
        row.slug = unique_slug(db, base, exclude_id=row.id)
    apply_event_in(row, payload)
    db.commit()
    db.refresh(row)
    return event_to_out(row)


@router.delete("/api/admin/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    _admin: models.AdminUser = Depends(get_current_admin),
):
    row = db.get(models.Event, event_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(row)
    db.commit()
    return None
