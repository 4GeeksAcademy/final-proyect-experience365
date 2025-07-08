from api.database.db import db
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
import bcrypt


class User(db.Model):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=True)
    lastname: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    payments = db.relationship(
        'Payments',
        back_populates='user',
        cascade='all, delete-orphan'
    )

    def set_password(self, password):
        """Encripta la contraseña"""
        salt = bcrypt.gensalt()
        self.password = bcrypt.hashpw(
            password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        """Verifica la contraseña"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active
        }
