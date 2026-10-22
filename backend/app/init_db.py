import sys
from datetime import date

from sqlalchemy import select

from app import models
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.models import Announcement, FlyerTemplate, Pet, PetKind

DEFAULT_TEMPLATES = [
    ("classic", "Классический", "#c62828", "#ffffff"),
    ("bright", "Яркий", "#ff6f00", "#fff8e1"),
    ("mono", "Чёрно-белый", "#000000", "#ffffff"),
]


def main(demo: bool = False) -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        for code, title, header, bg in DEFAULT_TEMPLATES:
            if not db.scalar(select(FlyerTemplate.id).where(FlyerTemplate.code == code)):
                db.add(FlyerTemplate(code=code, title=title, header_color=header, background_color=bg))
        db.commit()

        if demo and not db.scalar(select(Pet.id)):
            rex = Pet(name="Рекс", kind=PetKind.dog, breed="Немецкая овчарка", color="Чёрно-рыжий",
                      description="Откликается на кличку, синий ошейник.")
            murka = Pet(name="Мурка", kind=PetKind.cat, breed="Дворовая", color="Серая полосатая")
            db.add_all([rex, murka])
            db.flush()
            db.add_all([
                Announcement(pet_id=rex.id, last_seen_place="Парк Горького, главный вход",
                             last_seen_at=date(2026, 10, 1), contact_name="Анна", contact_phone="+7 900 000-00-01"),
                Announcement(pet_id=murka.id, last_seen_place="ул. Ленина, 15",
                             last_seen_at=date(2026, 9, 28), contact_name="Игорь", contact_phone="+7 900 000-00-02"),
            ])
            db.commit()
    print("Таблицы созданы" + (", демо-данные добавлены" if demo else ""))


if __name__ == "__main__":
    main(demo="--demo" in sys.argv)
