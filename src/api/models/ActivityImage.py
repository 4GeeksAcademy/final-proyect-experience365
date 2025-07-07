from api.database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

class ActivityImage(db.Model):
    __tablename__ = 'activity_images'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activity.id"), nullable=False)
    url: Mapped[str] = mapped_column(nullable=False)
    
    activity = relationship("Activity", back_populates="images")

    def serialize(self):
        return {
            "id": self.id,
            "url": self.url
        }