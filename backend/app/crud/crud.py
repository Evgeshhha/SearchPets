from typing import TypeVar

from sqlalchemy import select, update
from sqlalchemy.orm import Session, joinedload

from app.core.errors import ConflictError, NotFoundError
from app.models.models import (
    Announcement,
    AnnouncementStatus,
    FlyerTemplate,
    Pet,
    PetKind,
    Sighting,
)
from app.schemas import (
    AnnouncementCreate,
    AnnouncementUpdate,
    FlyerTemplateCreate,
    FlyerTemplateUpdate,
    PetCreate,
    PetUpdate,
    SightingCreate,
)

T = TypeVar("T")

def _get_or_404(db: Session, model: type[T], obj_id: int, label: str) -> T:
    obj = db.get(model, obj_id)
    if obj is None:
        raise NotFoundError(f"{label} с id={obj_id} не найден(а)")
    return obj

def _apply(obj, data: dict) -> None:
    for key, value in data.items():
        setattr(obj, key, value)

def list_pets(db: Session, kind: PetKind | None, limit: int, offset: int) -> list[Pet]:
    stmt = select(Pet).order_by(Pet.id).limit(limit).offset(offset)
    if kind:
        stmt = stmt.where(Pet.kind == kind)
    return list(db.scalars(stmt))

def get_pet(db: Session, pet_id: int) -> Pet:
    return _get_or_404(db, Pet, pet_id, "Животное")

def create_pet(db: Session, data: PetCreate) -> Pet:
    pet = Pet(**data.model_dump())
    db.add(pet)
    db.commit()
    return pet

def update_pet(db: Session, pet_id: int, data: PetUpdate) -> Pet:
    pet = get_pet(db, pet_id)
    changes = data.model_dump(exclude_unset=True)
    for required in ("name", "kind"):
        if required in changes and changes[required] is None:
            raise ConflictError(f"Поле {required} нельзя очистить")
    _apply(pet, changes)
    db.commit()
    return pet

def delete_pet(db: Session, pet_id: int) -> None:
    db.delete(get_pet(db, pet_id))
    db.commit()

def list_templates(db: Session) -> list[FlyerTemplate]:
    return list(db.scalars(select(FlyerTemplate).order_by(FlyerTemplate.id)))

def get_template(db: Session, template_id: int) -> FlyerTemplate:
    return _get_or_404(db, FlyerTemplate, template_id, "Шаблон листовки")

def create_template(db: Session, data: FlyerTemplateCreate) -> FlyerTemplate:
    exists = db.scalar(select(FlyerTemplate.id).where(FlyerTemplate.code == data.code))
    if exists:
        raise ConflictError(f"Шаблон с кодом '{data.code}' уже существует")
    tpl = FlyerTemplate(**data.model_dump())
    db.add(tpl)
    db.commit()
    return tpl

def update_template(db: Session, template_id: int, data: FlyerTemplateUpdate) -> FlyerTemplate:
    tpl = get_template(db, template_id)
    changes = data.model_dump(exclude_unset=True)
    if any(v is None for v in changes.values()):
        raise ConflictError("Поля шаблона нельзя очистить")
    _apply(tpl, changes)
    db.commit()
    return tpl

def delete_template(db: Session, template_id: int) -> None:
    tpl = get_template(db, template_id)
    db.execute(
        update(Announcement)
        .where(Announcement.flyer_template_id == template_id)
        .values(flyer_template_id=None)
    )
    db.delete(tpl)
    db.commit()

def list_announcements(
    db: Session,
    status: AnnouncementStatus | None,
    kind: PetKind | None,
    q: str | None,
    limit: int,
    offset: int,
) -> list[Announcement]:
    stmt = (
        select(Announcement)
        .join(Announcement.pet)
        .options(joinedload(Announcement.pet))
        .order_by(Announcement.created_at.desc(), Announcement.id.desc())
        .limit(limit)
        .offset(offset)
    )
    if status:
        stmt = stmt.where(Announcement.status == status)
    if kind:
        stmt = stmt.where(Pet.kind == kind)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(Pet.name.ilike(like) | Announcement.last_seen_place.ilike(like))
    return list(db.scalars(stmt))

def get_announcement(db: Session, ann_id: int) -> Announcement:
    return _get_or_404(db, Announcement, ann_id, "Объявление")

def create_announcement(db: Session, data: AnnouncementCreate) -> Announcement:
    if data.flyer_template_id is not None:
        get_template(db, data.flyer_template_id)

    if data.pet is not None:
        pet = Pet(**data.pet.model_dump())
        db.add(pet)
        db.flush()
    else:
        pet = get_pet(db, data.pet_id)

    ann = Announcement(
        pet_id=pet.id,
        **data.model_dump(exclude={"pet", "pet_id"}),
    )
    db.add(ann)
    db.commit()
    return ann

def update_announcement(db: Session, ann_id: int, data: AnnouncementUpdate) -> Announcement:
    ann = get_announcement(db, ann_id)
    changes = data.model_dump(exclude_unset=True)
    for required in ("last_seen_place", "last_seen_at", "status", "contact_name", "contact_phone"):
        if required in changes and changes[required] is None:
            raise ConflictError(f"Поле {required} нельзя очистить")
    if changes.get("flyer_template_id") is not None:
        get_template(db, changes["flyer_template_id"])

    lat = changes.get("latitude", ann.latitude)
    lon = changes.get("longitude", ann.longitude)
    if (lat is None) != (lon is None):
        raise ConflictError("Координаты задаются парой: latitude и longitude")

    _apply(ann, changes)
    db.commit()
    return ann

def delete_announcement(db: Session, ann_id: int) -> None:
    db.delete(get_announcement(db, ann_id))
    db.commit()

def list_sightings(db: Session, ann_id: int) -> list[Sighting]:
    return list(get_announcement(db, ann_id).sightings)

def create_sighting(db: Session, ann_id: int, data: SightingCreate) -> Sighting:
    ann = get_announcement(db, ann_id)
    if ann.status == AnnouncementStatus.closed:
        raise ConflictError("Объявление закрыто: добавлять отметки нельзя")
    sighting = Sighting(announcement_id=ann.id, **data.model_dump())
    db.add(sighting)
    db.commit()
    return sighting

def delete_sighting(db: Session, ann_id: int, sighting_id: int) -> None:
    get_announcement(db, ann_id)
    sighting = db.get(Sighting, sighting_id)
    if sighting is None or sighting.announcement_id != ann_id:
        raise NotFoundError(f"Отметка с id={sighting_id} не найдена в объявлении id={ann_id}")
    db.delete(sighting)
    db.commit()
