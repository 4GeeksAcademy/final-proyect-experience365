from api.database.db import db
from sqlalchemy import String, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone


class Activity(db.Model):

    __tablename__ = 'activity'
    id: Mapped[int] = mapped_column(primary_key=True)
    profesional_id: Mapped[int] = mapped_column(
        ForeignKey("professional.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(125), nullable=False)
    description: Mapped[str] = mapped_column(Text(), nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    rate: Mapped[float] = mapped_column(Float, nullable=True)
    img: Mapped[str] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)
    activity_date: Mapped[str] = mapped_column(
        String(100)
    )

    payments = relationship(
        "Payments", back_populates="activity", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "rate": self.rate,
            "img": self.img,
            "is_active": self.is_active,
            "activity_date": self.activity_date
        }
