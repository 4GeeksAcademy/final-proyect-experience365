from flask import Blueprint, request, jsonify
from api.database.db import db
from api.models.Globalrate import GlobalRate


api = Blueprint("/api/rating", __name__)

@api.route("/", methods=["POST"])

def create_rating():
    data = request.get_json()

    try:
        new_rating = GlobalRate(
            activity_id=data["activity_id"],
            user_id=data["user_id"],
            stars=data["stars"],
            comment=data.get("comment", "")
        )
        db.session.add(new_rating)
        db.session.commit()

        GlobalRate.update_activity_rate(data["activity_id"])

        return jsonify({"message": "Rating creado", "rating": new_rating.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
