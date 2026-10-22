import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class PetKind(str, enum.Enum):
    dog = "dog"
    cat = "cat"
    other = "other"


class AnnouncementStatus(str, enum.Enum):
    searching = "searching"
    found = "found"
    closed = "closed"


class Pet(Base):
    __tablename__ = "pets"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    kind: Mapped[PetKind] = mapped_column(Enum(PetKind, name="pet_kind"))
    breed: Mapped[str | None] = mapped_column(String(100))
    color: Mapped[str | None] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    photo_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    announcements: Mapped[list["Announcement"]] = relationship(
        back_populates="pet", cascade="all, delete-orphan"
    )


class FlyerTemplate(Base):
    __tablename__ = "flyer_templates"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    title: Mapped[str] = mapped_column(String(100))
    header_color: Mapped[str] = mapped_column(String(7))
    background_color: Mapped[str] = mapped_column(String(7))


class Announcement(Base):
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(primary_key=True)
    pet_id: Mapped[int] = mapped_column(ForeignKey("pets.id", ondelete="CASCADE"), index=True)
    flyer_template_id: Mapped[int | None] = mapped_column(
        ForeignKey("flyer_templates.id", ondelete="SET NULL")
    )
    last_seen_place: Mapped[str] = mapped_column(String(255))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    last_seen_at: Mapped[date] = mapped_column(Date)
    status: Mapped[AnnouncementStatus] = mapped_column(
        Enum(AnnouncementStatus, name="announcement_status"),
        default=AnnouncementStatus.searching,
        index=True,
    )
    contact_name: Mapped[str] = mapped_column(String(100))
    contact_phone: Mapped[str] = mapped_column(String(30))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    pet: Mapped[Pet] = relationship(back_populates="announcements")
    flyer_template: Mapped[FlyerTemplate | None] = relationship()
    sightings: Mapped[list["Sighting"]] = relationship(
        back_populates="announcement", cascade="all, delete-orphan", order_by="Sighting.seen_at.desc()"
    )


class Sighting(Base):
    __tablename__ = "sightings"

    id: Mapped[int] = mapped_column(primary_key=True)
    announcement_id: Mapped[int] = mapped_column(
        ForeignKey("announcements.id", ondelete="CASCADE"), index=True
    )
    place: Mapped[str] = mapped_column(String(255))
    seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    comment: Mapped[str | None] = mapped_column(Text)
    contact: Mapped[str | None] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    announcement: Mapped[Announcement] = relationship(back_populates="sightings")
