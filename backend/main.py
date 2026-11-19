from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import router
from app.core.config import get_settings
from app.core.errors import register_error_handlers
from app.db.init_db import init_db

settings = get_settings()

app = FastAPI(title="Найдись, друг! API", version="0.1.0")
@app.on_event("startup")
def on_startup():
    init_db()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_error_handlers(app)
app.include_router(router)

Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=settings.upload_dir), name="media")

@app.get("/health", tags=["Служебное"])
def health():
    return {"status": "ok"}
