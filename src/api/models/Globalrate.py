from api.database.db import db
from api.models.Activity import Activity
from sqlalchemy import ForeignKey, Integer, Text, func, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models.User import User


class GlobalRate(db.Model):
    __tablename__ = 'rating'

    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activity.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    stars: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text(), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity", backref="ratings")
    user = relationship(User)

    def serialize(self):
        return {
            "id": self.id,
            "activity_id": self.activity_id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else "Usuario",
            "stars": self.stars,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
    


    @staticmethod
    def update_activity_rate(activity_id: int):
        average = db.session.query(func.avg(GlobalRate.stars)) \
            .filter(GlobalRate.activity_id == activity_id) \
            .scalar()

        global_rate = round(average, 2) if average is not None else 0

        activity = db.session.query(Activity).get(activity_id)
        if activity:
            activity.rate = global_rate
            db.session.commit()