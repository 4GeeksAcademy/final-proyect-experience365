from flask import Flask, request, jsonify, url_for, Blueprint
from api.database.db import db
from api.models.Activity import Activity
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from api.models.Professional import Professional

from flask_jwt_extended import jwt_required, get_jwt_identity

api = Blueprint('/api/activity', __name__)


CORS(api)


@api.route('/', methods=['GET'])
def get_activities():
    activities = Activity.query.all()
    return jsonify([a.serialize() for a in activities]), 200


@api.route('/', methods=['POST'])
@jwt_required()
def create_activity():
    current_user_id = get_jwt_identity()

    professional = Professional.query.filter_by(
        user_id=current_user_id).first()
    if not professional:
        return jsonify({"error": "Only professionals can create activities"}), 403

    data = request.get_json()

    new_activity = Activity(
        profesional_id=professional.id,
        description=data.get('description'),
        price=data.get('price'),
        rate=data.get('rate'),
        # status=data.get('status')
        is_active=data.get('is_active', True),
        activity_date=datetime.fromisoformat(
            data['activity_date']) if data.get('activity_date') else None

    )
    db.session.add(new_activity)
    db.session.commit()
    return jsonify(new_activity.serialize()), 201


@api.route('/<int:id>', methods=['GET'])
def get_activity(id):
    activity = Activity.query.get_or_404(id)
    return jsonify(activity.serialize()), 200
