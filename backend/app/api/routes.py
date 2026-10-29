from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.crud import crud
from app.db.session import get_db
from app.models.models import AnnouncementStatus, PetKind
from app.schemas import (
    AnnouncementCreate,
    AnnouncementRead,
    AnnouncementUpdate,
    FlyerTemplateCreate,
    FlyerTemplateRead,
    FlyerTemplateUpdate,
    PetCreate,
    PetRead,
    PetUpdate,
    ShareInfo,
    SightingCreate,
    SightingRead,
)

router = APIRouter(prefix="/api")
pets = APIRouter(prefix="/pets", tags=["Животные"])
templates = APIRouter(prefix="/flyer-templates", tags=["Шаблоны листовок"])
announcements = APIRouter(prefix="/announcements", tags=["Объявления"])

@pets.get("", response_model=list[PetRead])
def list_pets(
    kind: PetKind | None = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    return crud.list_pets(db, kind, limit, offset)

@pets.post("", response_model=PetRead, status_code=status.HTTP_201_CREATED)
def create_pet(data: PetCreate, db: Session = Depends(get_db)):
    return crud.create_pet(db, data)

@pets.get("/{pet_id}", response_model=PetRead)
def get_pet(pet_id: int, db: Session = Depends(get_db)):
    return crud.get_pet(db, pet_id)

@pets.patch("/{pet_id}", response_model=PetRead)
def update_pet(pet_id: int, data: PetUpdate, db: Session = Depends(get_db)):
    return crud.update_pet(db, pet_id, data)

@pets.delete("/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pet(pet_id: int, db: Session = Depends(get_db)):
    crud.delete_pet(db, pet_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@templates.get("", response_model=list[FlyerTemplateRead])
def list_templates(db: Session = Depends(get_db)):
    return crud.list_templates(db)

@templates.post("", response_model=FlyerTemplateRead, status_code=status.HTTP_201_CREATED)
def create_template(data: FlyerTemplateCreate, db: Session = Depends(get_db)):
    return crud.create_template(db, data)

@templates.get("/{template_id}", response_model=FlyerTemplateRead)
def get_template(template_id: int, db: Session = Depends(get_db)):
    return crud.get_template(db, template_id)

@templates.patch("/{template_id}", response_model=FlyerTemplateRead)
def update_template(template_id: int, data: FlyerTemplateUpdate, db: Session = Depends(get_db)):
    return crud.update_template(db, template_id, data)

@templates.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(template_id: int, db: Session = Depends(get_db)):
    crud.delete_template(db, template_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@announcements.get("", response_model=list[AnnouncementRead])
def list_announcements(
    status: AnnouncementStatus | None = None,
    kind: PetKind | None = None,
    q: str | None = Query(None, max_length=100, description="Поиск по кличке и месту"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    return crud.list_announcements(db, status, kind, q, limit, offset)

@announcements.post("", response_model=AnnouncementRead, status_code=201)
def create_announcement(data: AnnouncementCreate, db: Session = Depends(get_db)):
    return crud.create_announcement(db, data)

@announcements.get("/{ann_id}", response_model=AnnouncementRead)
def get_announcement(ann_id: int, db: Session = Depends(get_db)):
    return crud.get_announcement(db, ann_id)

@announcements.patch("/{ann_id}", response_model=AnnouncementRead)
def update_announcement(ann_id: int, data: AnnouncementUpdate, db: Session = Depends(get_db)):
    return crud.update_announcement(db, ann_id, data)

@announcements.delete("/{ann_id}", status_code=204)
def delete_announcement(ann_id: int, db: Session = Depends(get_db)):
    crud.delete_announcement(db, ann_id)
    return Response(status_code=204)

@announcements.get("/{ann_id}/share", response_model=ShareInfo)
def share_announcement(ann_id: int, db: Session = Depends(get_db)):
    ann = crud.get_announcement(db, ann_id)
    base = get_settings().frontend_url.rstrip("/")
    return ShareInfo(
        url=f"{base}/pets/{ann.id}",
        title=f"Пропал питомец: {ann.pet.name}",
        text=f"Помогите найти: {ann.pet.name}. Последний раз видели: {ann.last_seen_place}. "
        f"Контакт: {ann.contact_name}, {ann.contact_phone}",
    )

@announcements.get("/{ann_id}/sightings", response_model=list[SightingRead])
def list_sightings(ann_id: int, db: Session = Depends(get_db)):
    return crud.list_sightings(db, ann_id)

@announcements.post("/{ann_id}/sightings", response_model=SightingRead, status_code=201)
def create_sighting(ann_id: int, data: SightingCreate, db: Session = Depends(get_db)):
    return crud.create_sighting(db, ann_id, data)

@announcements.delete("/{ann_id}/sightings/{sighting_id}", status_code=204)
def delete_sighting(ann_id: int, sighting_id: int, db: Session = Depends(get_db)):
    crud.delete_sighting(db, ann_id, sighting_id)
    return Response(status_code=204)

router.include_router(pets)
router.include_router(templates)
router.include_router(announcements)
