from api.database.db import db
from api.models.Activity import Activity
from sqlalchemy import ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship



class GlobalRate(db.Model):
    __tablename__ = 'rating'

    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(ForeignKey("activity.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    stars: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text(), nullable=False)

    activity = relationship("Activity", backref="ratings")

    def serialize(self):
        return {
            "id": self.id,
            "activity_id": self.activity_id,
            "user_id": self.user_id,
            "stars": self.stars,
            "comment": self.comment
        }
    


    @staticmethod
    def update_activity_rate(activity_id: int):
        average = db.session.query(func.avg(GlobalRate.stars)) \
            .filter(GlobalRate.activity_id == activity_id) \
            .scalar()

        global_rate = round(average, 2) if average else 0

        activity = db.session.query(Activity).get(activity_id)
        if activity:
            activity.rate = global_rate
            db.session.commit()