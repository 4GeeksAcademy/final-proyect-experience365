# src/api/models/Payment.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from api.database.db import db

# Payment Model for Stripe


class Payments(db.Model):
    __tablename__ = 'payments'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    activity_id = Column(Integer, ForeignKey('activity.id'), nullable=False)
    stripe_session_id = Column(String(120), unique=True, nullable=False)
    status = Column(String(50), nullable=False, default='pending')
    amount = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="payments")
    activity = relationship("Activity", back_populates="payments")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "activity_id": self.activity_id,
            "stripe_session_id": self.stripe_session_id,
            "status": self.status,
            "amount": self.amount,
            "created_at": self.created_at
        }
