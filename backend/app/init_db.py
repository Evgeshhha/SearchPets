import sys
from datetime import date

from sqlalchemy import select

from app import models
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.core.security import hash_password
from app.models.models import Announcement, FlyerTemplate, Pet, PetKind, User

DEMO_EMAIL = "demo@example.com"
DEMO_PASSWORD = "demo12345"

DEFAULT_TEMPLATES = [
    ("classic", "Классический", "#c62828", "#ffffff"),
    ("bright", "Яркий", "#ff6f00", "#fff8e1"),
    ("mono", "Чёрно-белый", "#000000", "#ffffff"),
]


def main(demo: bool = False, reset: bool = False) -> None:
    if reset:
        Base.metadata.drop_all(engine)  
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        for code, title, header, bg in DEFAULT_TEMPLATES:
            if not db.scalar(select(FlyerTemplate.id).where(FlyerTemplate.code == code)):
                db.add(FlyerTemplate(code=code, title=title, header_color=header, background_color=bg))
        db.commit()

        if demo and not db.scalar(select(Pet.id)):
            owner = db.scalar(select(User).where(User.email == DEMO_EMAIL))
            if owner is None:
                owner = User(email=DEMO_EMAIL, name="Демо", password_hash=hash_password(DEMO_PASSWORD))
                db.add(owner)
                db.flush()
            rex = Pet(name="Рекс", kind=PetKind.dog, breed="Немецкая овчарка", color="Чёрно-рыжий",
                      description="Откликается на кличку, синий ошейник.", owner_id=owner.id)
            murka = Pet(name="Мурка", kind=PetKind.cat, breed="Дворовая", color="Серая полосатая",
                        owner_id=owner.id)
            db.add_all([rex, murka])
            db.flush()
            db.add_all([
                Announcement(pet_id=rex.id, last_seen_place="Парк Горького, главный вход",
                             last_seen_at=date(2026, 10, 1), contact_name="Анна", contact_phone="+7 900 000-00-01",
                             owner_id=owner.id),
                Announcement(pet_id=murka.id, last_seen_place="ул. Ленина, 15",
                             last_seen_at=date(2026, 9, 28), contact_name="Игорь", contact_phone="+7 900 000-00-02",
                             owner_id=owner.id),
            ])
            db.commit()
    print("Таблицы созданы" + (", демо-данные добавлены" if demo else ""))
    if demo:
        print(f"Демо-пользователь: {DEMO_EMAIL} / {DEMO_PASSWORD} (только для разработки!)")


if __name__ == "__main__":
    main(demo="--demo" in sys.argv, reset="--reset" in sys.argv)
