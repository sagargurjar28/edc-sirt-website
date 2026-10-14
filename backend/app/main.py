from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import auth, blogs, events, students, uploads

Base.metadata.create_all(bind=engine)

from sqlalchemy import text

with engine.begin() as conn:
    conn.execute(text("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content TEXT"))
    conn.execute(text("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500)"))

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
