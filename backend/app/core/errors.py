from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError


class NotFoundError(Exception):
    """Запись не найдена -> 404."""


class ConflictError(Exception):
    """Операция противоречит текущему состоянию данных -> 409."""


class BadRequestError(Exception):
    """Некорректные данные запроса, которые не описываются схемой (например, содержимое файла) -> 400."""


class UnauthorizedError(Exception):
    """Нет действительных учётных данных (токен отсутствует, истёк, отозван) -> 401."""


class ForbiddenError(Exception):
    """Пользователь аутентифицирован, но не имеет права на операцию -> 403."""


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(NotFoundError)
    async def not_found_handler(_: Request, exc: NotFoundError):
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(ConflictError)
    async def conflict_handler(_: Request, exc: ConflictError):
        return JSONResponse(status_code=409, content={"detail": str(exc)})

    @app.exception_handler(BadRequestError)
    async def bad_request_handler(_: Request, exc: BadRequestError):
        return JSONResponse(status_code=400, content={"detail": str(exc)})

    @app.exception_handler(UnauthorizedError)
    async def unauthorized_handler(_: Request, exc: UnauthorizedError):
        return JSONResponse(
            status_code=401,
            content={"detail": str(exc)},
            headers={"WWW-Authenticate": "Bearer"},
        )

    @app.exception_handler(ForbiddenError)
    async def forbidden_handler(_: Request, exc: ForbiddenError):
        return JSONResponse(status_code=403, content={"detail": str(exc)})

    @app.exception_handler(IntegrityError)
    async def integrity_handler(_: Request, exc: IntegrityError):
        return JSONResponse(
            status_code=409,
            content={"detail": "Нарушено ограничение целостности данных (дубликат или связанная запись)"},
        )
