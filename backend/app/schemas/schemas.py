from datetime import date, datetime, timezone
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator

from app.models.models import AnnouncementStatus, PetKind

Phone = Annotated[str, StringConstraints(strip_whitespace=True, pattern=r"^\+?[0-9][0-9\s\-()]{5,28}$")]
HexColor = Annotated[str, StringConstraints(pattern=r"^#[0-9a-fA-F]{6}$")]
Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]

class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class PetCreate(BaseModel):
    name: Name
    kind: PetKind
    breed: str | None = Field(None, max_length=100)
    color: str | None = Field(None, max_length=100)
    description: str | None = Field(None, max_length=2000)
    photo_url: str | None = Field(None, max_length=500)

class PetUpdate(BaseModel):
    name: Name | None = None
    kind: PetKind | None = None
    breed: str | None = Field(None, max_length=100)
    color: str | None = Field(None, max_length=100)
    description: str | None = Field(None, max_length=2000)
    photo_url: str | None = Field(None, max_length=500)

class PetRead(ORMModel, PetCreate):
    id: int
    created_at: datetime

class FlyerTemplateCreate(BaseModel):
    code: str = Field(min_length=1, max_length=50, pattern=r"^[a-z0-9_-]+$")
    title: Name
    header_color: HexColor
    background_color: HexColor

class FlyerTemplateUpdate(BaseModel):
    title: Name | None = None
    header_color: HexColor | None = None
    background_color: HexColor | None = None

class FlyerTemplateRead(ORMModel, FlyerTemplateCreate):
    id: int

def _check_coords(lat: float | None, lon: float | None) -> None:
    if (lat is None) != (lon is None):
        raise ValueError("Координаты задаются парой: укажите и latitude, и longitude")

class AnnouncementCreate(BaseModel):
    pet_id: int | None = Field(None, gt=0)
    pet: PetCreate | None = None
    flyer_template_id: int | None = Field(None, gt=0)
    last_seen_place: str = Field(min_length=1, max_length=255)
    latitude: float | None = Field(None, ge=-90, le=90)
    longitude: float | None = Field(None, ge=-180, le=180)
    last_seen_at: date
    status: AnnouncementStatus = AnnouncementStatus.searching
    contact_name: Name
    contact_phone: Phone

    @model_validator(mode="after")
    def _validate(self):
        if (self.pet_id is None) == (self.pet is None):
            raise ValueError("Укажите ровно одно из полей: pet_id или pet")
        if self.last_seen_at > date.today():
            raise ValueError("Дата пропажи не может быть в будущем")
        _check_coords(self.latitude, self.longitude)
        return self

class AnnouncementUpdate(BaseModel):
    flyer_template_id: int | None = Field(None, gt=0)
    last_seen_place: str | None = Field(None, min_length=1, max_length=255)
    latitude: float | None = Field(None, ge=-90, le=90)
    longitude: float | None = Field(None, ge=-180, le=180)
    last_seen_at: date | None = None
    status: AnnouncementStatus | None = None
    contact_name: Name | None = None
    contact_phone: Phone | None = None

    @model_validator(mode="after")
    def _validate(self):
        if self.last_seen_at and self.last_seen_at > date.today():
            raise ValueError("Дата пропажи не может быть в будущем")
        return self

class AnnouncementRead(ORMModel):
    id: int
    pet: PetRead
    flyer_template_id: int | None
    last_seen_place: str
    latitude: float | None
    longitude: float | None
    last_seen_at: date
    status: AnnouncementStatus
    contact_name: str
    contact_phone: str
    created_at: datetime
    updated_at: datetime

class ShareInfo(BaseModel):
    url: str
    title: str
    text: str

class SightingCreate(BaseModel):
    place: str = Field(min_length=1, max_length=255)
    seen_at: datetime
    comment: str | None = Field(None, max_length=2000)
    contact: str | None = Field(None, max_length=100)

    @model_validator(mode="after")
    def _validate(self):
        seen = self.seen_at if self.seen_at.tzinfo else self.seen_at.replace(tzinfo=timezone.utc)
        if seen > datetime.now(timezone.utc):
            raise ValueError("Время наблюдения не может быть в будущем")
        return self

class SightingRead(ORMModel, SightingCreate):
    id: int
    announcement_id: int
    created_at: datetime