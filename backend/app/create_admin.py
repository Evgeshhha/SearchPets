"""Создание администратора: python -m app.create_admin admin@example.com "Имя" """
import getpass
import sys

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.models import User


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit('Использование: python -m app.create_admin <email> "<имя>"')
    email, name = sys.argv[1].lower(), sys.argv[2]
    password = getpass.getpass("Пароль (не менее 8 символов): ")
    if len(password) < 8:
        sys.exit("Пароль слишком короткий")

    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email))
        if user:
            user.is_admin = True  
        else:
            db.add(User(email=email, name=name, password_hash=hash_password(password), is_admin=True))
        db.commit()
    print(f"Администратор {email} готов")


if __name__ == "__main__":
    main()
