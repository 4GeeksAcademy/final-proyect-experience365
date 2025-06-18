from api.database.db import db
from sqlalchemy import String, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

class Activity(db.Model):

    __tablename__ = 'activity'
    id: Mapped[int] = mapped_column(primary_key=True)
    profesional_id: Mapped[int] = mapped_column(ForeignKey("Professional.id"), nullable=False)
    description: Mapped[str] = mapped_column(Text(), nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    rate: Mapped[int] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "price": self.price,
            "rate": self.rate,
            "email": self.email,
            "password": self.password,
            "status": self.status
        }