from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import create_access_token, get_current_student, hash_password, verify_password
from ..database import get_db

router = APIRouter(tags=["student-auth"])


def student_to_out(row: models.Student) -> schemas.StudentOut:
    return schemas.StudentOut(id=f"student-{row.id}", name=row.name, email=row.email)


def issue_student_token(row: models.Student) -> schemas.StudentAuthResponse:
    return schemas.StudentAuthResponse(
        access_token=create_access_token(row.id, kind="student"),
        student=student_to_out(row),
    )


@router.post("/api/auth/register", response_model=schemas.StudentAuthResponse, status_code=status.HTTP_201_CREATED)
def student_register(payload: schemas.StudentRegister, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    existing = db.execute(
        select(models.Student).where(models.Student.email == email)
    ).scalar_one_or_none()
    if existing is not None:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    row = models.Student(
        name=payload.name.strip(),
        email=email,
        password_hash=hash_password(payload.password),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return issue_student_token(row)


@router.post("/api/auth/login", response_model=schemas.StudentAuthResponse)
def student_login(payload: schemas.StudentLogin, db: Session = Depends(get_db)):
    row = db.execute(
        select(models.Student).where(models.Student.email == payload.email.strip().lower())
    ).scalar_one_or_none()
    if row is None or not verify_password(payload.password, row.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return issue_student_token(row)


@router.get("/api/auth/me", response_model=schemas.StudentOut)
def student_me(student: models.Student = Depends(get_current_student)):
    return student_to_out(student)
