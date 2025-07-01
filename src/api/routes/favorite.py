from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from api.database.db import db
from api.models.Favorite import Favorite
from api.models.User import User
from api.models.Activity import Activity
from flask_cors import CORS

api = Blueprint('/api/favorite', __name__)
CORS(api)


@api.route('/', methods=['POST'])
@jwt_required()
def add_favorite():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        if not data or 'activity_id' not in data:
            return jsonify({"error": "activity_id is required"}), 400

        activity = Activity.query.get(data['activity_id'])
        if not activity:
            return jsonify({"error": "Activity not found"}), 404

        existing = Favorite.query.filter_by(
            user_id=current_user_id,
            activity_id=data['activity_id']
        ).first()

        if existing:
            return jsonify({"error": "Activity already in favorites"}), 400

        new_favorite = Favorite(
            user_id=current_user_id,
            activity_id=data['activity_id']
        )

        db.session.add(new_favorite)
        db.session.commit()

        return jsonify(new_favorite.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/user', methods=['GET'])
@jwt_required()
def get_user_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.serialize() for f in favorites]), 200


@api.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(id):
    current_user_id = get_jwt_identity()
    favorite = Favorite.query.get(id)

    # Verificar si el favorito existe
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404

    # Verificar si el favorito pertenece al usuario actual
    if favorite.user_id != int(current_user_id):
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Favorite removed"}), 200
