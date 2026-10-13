from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_admin
from ..database import get_db

router = APIRouter(tags=["uploads"])

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_BYTES = 5 * 1024 * 1024


@router.post("/api/admin/uploads", response_model=schemas.ImageUploadOut, status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    mime = (file.content_type or "").split(";")[0].strip().lower()
    if not mime.startswith("image/") or mime not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP or GIF images are allowed")
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 5 MB or smaller")
    row = models.ImageUpload(
        filename=(file.filename or "upload").strip() or "upload",
        mime_type=mime,
        size_bytes=len(data),
        data=data,
        uploaded_by=admin.id,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return schemas.ImageUploadOut(id=row.id, url=f"/api/images/{row.id}")


@router.get("/api/images/{image_id}")
def serve_image(image_id: int, db: Session = Depends(get_db)):
    row = db.get(models.ImageUpload, image_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(
        content=row.data,
        media_type=row.mime_type,
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
