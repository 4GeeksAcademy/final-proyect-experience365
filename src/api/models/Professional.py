from api.database.db import db
from api.models.User import User
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column


class Professional(db.Model):

    __tablename__ = "professional"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    cif: Mapped[str] = mapped_column(nullable=False)
    adress: Mapped[str] = mapped_column(nullable=False)
    phone: Mapped[str] = mapped_column(nullable=False)
    web: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    image: Mapped[str] = mapped_column(nullable=False)
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
            "name": self.user.name if self.user else "",
            "lastname": self.user.lastname if self.user else "",
            "email": self.user.email if self.user else "",
            "cif": self.cif,
            "adress": self.adress,
            "phone": self.phone,
            "web": self.web,
            "description": self.description,
            "image": self.image,
            "facebook": self.facebook,
            "instagram": self.instagram,
            "twitter": self.twitter,
            "linkedin": self.linkedin,
            "is_active": self.is_active
        }