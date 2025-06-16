from api.database.db import db
from api.models.User import User
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column


class Professional(db.Model):

    __tablename__ = "Professional"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("User.id"), nullable=False)
    cif: Mapped[str] = mapped_column(nullable=False)
    direccion: Mapped[str] = mapped_column(nullable=False)
    telefono: Mapped[str] = mapped_column(nullable=False)
    web: Mapped[str] = mapped_column(nullable=False)
    descripcion: Mapped[str] = mapped_column(nullable=False)
    imagen: Mapped[str] = mapped_column(nullable=False)
    facebook: Mapped[str] = mapped_column(nullable=False)
    instagram: Mapped[str] = mapped_column(nullable=False)
    twitter: Mapped[str] = mapped_column(nullable=False)
    linkedin: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    user = db.relationship('User', backref='professional', uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "web": self.web,
            "description": self.descripcion,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
