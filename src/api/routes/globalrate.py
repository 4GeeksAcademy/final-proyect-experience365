from flask import Blueprint, request, jsonify
from api.database.db import db
from api.models.Globalrate import GlobalRate
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models.Purchase import Purchase
from flask_cors import CORS


api = Blueprint("/api/rating", __name__)
CORS(api)


# Crear reseña
@api.route("/", methods=["POST"])
@jwt_required()
def create_rating():
    data = request.get_json()
    user_id = get_jwt_identity()

    try:
        new_rating = GlobalRate(
            activity_id=data["activity_id"],
            user_id=user_id,
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


@api.route("/allowed/<int:activity_id>", methods=["GET"])
@jwt_required()
def can_user_review(activity_id):
    user_id = get_jwt_identity()

    has_purchased = Purchase.query.filter_by(
        user_id=user_id,
        activity_id=activity_id
    ).first()

    return jsonify({"allowed": bool(has_purchased)})


# Endpoint para ver todas las actividades
@api.route("/activity/<int:activity_id>", methods=["GET"])
def get_reviews_for_activity(activity_id):
    try:
        ratings = GlobalRate.query.filter_by(activity_id=activity_id).all()
        serialized = [r.serialize() for r in ratings]

        return jsonify({"reviews": serialized}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
