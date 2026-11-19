import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import ConflictError, UnauthorizedError
from app.core.security import (
    create_access_token,
    dummy_password_hash,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    password_needs_rehash,
    verify_password,
)
from app.models.models import RefreshToken, User
from app.schemas import LoginRequest, TokenPair, UserCreate

INVALID_CREDENTIALS = "Неверный email или пароль"


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _as_utc(value: datetime) -> datetime:
    return value if value.tzinfo else value.replace(tzinfo=timezone.utc)


def register_user(db: Session, data: UserCreate) -> User:
    email = data.email.lower()
    if db.scalar(select(User.id).where(User.email == email)):
        raise ConflictError("Пользователь с таким email уже зарегистрирован")
    user = User(email=email, name=data.name, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    return user


def _issue_tokens(db: Session, user: User, session_id: str) -> TokenPair:
    settings = get_settings()
    raw_refresh = generate_refresh_token()
    db.add(
        RefreshToken(
            user_id=user.id,
            session_id=session_id,
            token_hash=hash_refresh_token(raw_refresh),
            expires_at=_now() + timedelta(days=settings.refresh_token_expire_days),
        )
    )
    return TokenPair(
        access_token=create_access_token(user.id),
        refresh_token=raw_refresh,
        expires_in=settings.access_token_expire_minutes * 60,
    )


def login(db: Session, data: LoginRequest) -> TokenPair:
    user = db.scalar(select(User).where(User.email == data.email.lower()))
    if user is None:
        verify_password(dummy_password_hash(), data.password)  # выравниваем время ответа
        raise UnauthorizedError(INVALID_CREDENTIALS)
    if not verify_password(user.password_hash, data.password):
        raise UnauthorizedError(INVALID_CREDENTIALS)
    if password_needs_rehash(user.password_hash):
        user.password_hash = hash_password(data.password)

    db.execute(delete(RefreshToken).where(RefreshToken.user_id == user.id, RefreshToken.expires_at < _now()))
    tokens = _issue_tokens(db, user, session_id=str(uuid.uuid4()))
    db.commit()
    return tokens


def _revoke_session(db: Session, session_id: str) -> None:
    db.execute(
        update(RefreshToken)
        .where(RefreshToken.session_id == session_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=_now())
    )


def refresh(db: Session, raw_token: str) -> TokenPair:
    """Обмен действующего refresh token на новую пару (ротация: старый токен сразу отзывается)."""
    row = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(raw_token)))
    if row is None:
        raise UnauthorizedError("Недействительный refresh token")

    if row.revoked_at is not None:
        _revoke_session(db, row.session_id)
        db.commit()
        raise UnauthorizedError("Refresh token отозван, войдите заново")

    if _as_utc(row.expires_at) <= _now():
        raise UnauthorizedError("Срок действия refresh token истёк, войдите заново")

    user = db.get(User, row.user_id)
    if user is None:
        raise UnauthorizedError("Недействительный refresh token")

    row.revoked_at = _now()
    tokens = _issue_tokens(db, user, session_id=row.session_id)
    db.commit()
    return tokens


def logout(db: Session, raw_token: str) -> None:
    """Завершает сессию, которой принадлежит токен. Для неизвестного токена ничего не делает (идемпотентно)."""
    row = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(raw_token)))
    if row is not None:
        _revoke_session(db, row.session_id)
        db.commit()
