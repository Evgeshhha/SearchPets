import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import get_settings
from app.core.errors import BadRequestError

MAX_PHOTO_BYTES = 5 * 1024 * 1024
CHUNK = 64 * 1024


def _detect_extension(head: bytes) -> str | None:
    """Определяем формат по содержимому, а не по имени файла или Content-Type от клиента."""
    if head.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if head.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return ".webp"
    return None


async def save_photo(file: UploadFile) -> str:
    """Сохраняет фото во внешний каталог под случайным именем и возвращает URL вида /media/<имя>."""
    head = await file.read(16)
    extension = _detect_extension(head)
    if extension is None:
        raise BadRequestError("Допустимые форматы изображения: JPEG, PNG, WebP")

    directory = Path(get_settings().upload_dir)
    directory.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4().hex}{extension}"
    path = directory / name

    size = len(head)
    try:
        with path.open("wb") as out:
            out.write(head)
            while chunk := await file.read(CHUNK):
                size += len(chunk)
                if size > MAX_PHOTO_BYTES:
                    raise BadRequestError("Размер файла не более 5 МБ")
                out.write(chunk)
    except BadRequestError:
        path.unlink(missing_ok=True)
        raise
    return f"/media/{name}"
