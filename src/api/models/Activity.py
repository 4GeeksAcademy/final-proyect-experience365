from api.database.db import db
from sqlalchemy import String, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone


class Activity(db.Model):

    __tablename__ = 'activity'
    id: Mapped[int] = mapped_column(primary_key=True)
    profesional_id: Mapped[int] = mapped_column(
        ForeignKey("Professional.id"), nullable=False)
    description: Mapped[str] = mapped_column(Text(), nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    rate: Mapped[int] = mapped_column(nullable=True)
    img: Mapped[str] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)
    activity_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "price": self.price,
            "rate": self.rate,
            "img": self.img,
            "is_active": self.is_active,
            "activity_date": self.activity_date.isoformat() if self.activity_date else None
        }
