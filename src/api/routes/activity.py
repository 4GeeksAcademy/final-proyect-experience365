from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Flask, request, jsonify, url_for, Blueprint
from api.database.db import db
from api.models.Activity import Activity
from api.models.ActivityImage import ActivityImage
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from api.models.Professional import Professional
import os
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

api = Blueprint('/api/activity', __name__)
CORS(api)


@api.route('/', methods=['GET'])
def get_activities():
    activities = Activity.query.order_by(Activity.id).all()
    return jsonify([a.serialize() for a in activities]), 200


@api.route('/', methods=['POST'])
@jwt_required()
def create_activity():
    current_user_id = get_jwt_identity()
    professional = Professional.query.filter_by(
        user_id=int(current_user_id)).first()

    if professional is None:
        return jsonify({"error": "Only professionals can create activities"}), 403

    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    city = request.form.get('city')
    duration = request.form.get('duration')
    img_url = None
    price_number = float(price.replace(",", "."))
    price_int = int(price_number)

    if "file" in request.files:
        file = request.files["file"]
        cloudinary_url = cloudinary.uploader.upload(file)
        img_url = cloudinary_url["url"]
    elif "img" in request.form:
        img_url = request.form.get('img')

    new_activity = Activity(
        profesional_id=professional.id,
        name=name,
        description=description,
        city=city,
        price=price_int,
        rate=None,
        img=img_url,
        is_active=True,
        activity_date=duration
    )

    db.session.add(new_activity)
    db.session.commit()

    return jsonify(new_activity.serialize()), 201


@api.route('/<int:id>', methods=['GET'])
def get_activity(id):
    try:
        activity = Activity.query.get_or_404(id)
        professional = Professional.query.get(activity.profesional_id)

        if not professional:
            raise APIException("Professional not found", status_code=404)

        activity_data = activity.serialize()
        activity_data["professional"] = professional.serialize()

        return jsonify(activity_data), 200
    except Exception as e:
        print(f"Error in get_activity: {str(e)}")
        raise APIException(str(e), status_code=500)


@api.route('/professional', methods=['GET'])
@jwt_required()
def get_professional_activities():
    try:
        user_id = get_jwt_identity()
        professional = Professional.query.filter_by(
            user_id=int(user_id)).first()

        if not professional:
            return jsonify({"error": "Professional not found"}), 404

        activities = Activity.query.filter_by(
            profesional_id=professional.id
        ).all()

        result = []
        for activity in activities:
            activity_data = activity.serialize()
            result.append(activity_data)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_activity(id):
    try:
        current_user_id = get_jwt_identity()
        professional = Professional.query.filter_by(
            user_id=int(current_user_id)).first()

        if not professional:
            return jsonify({"error": "Only professionals can update activities"}), 403

        activity = Activity.query.filter_by(
            id=id,
            profesional_id=professional.id
        ).first()

        if not activity:
            return jsonify({"error": "Activity not found or not owned by professional"}), 404

        data = request.form
        if 'name' in data:
            activity.name = data['name']
        if 'description' in data:
            activity.description = data['description']
        if 'price' in data:
            activity.price = int(float(data['price'].replace(",", ".")))
        if 'city' in data:
            activity.city = data['city']
        if 'duration' in data:
            activity.activity_date = data['duration']
        if 'is_active' in data:
            activity.is_active = data['is_active'].lower() == 'true'

        if "file" in request.files:
            file = request.files["file"]
            cloudinary_url = cloudinary.uploader.upload(file)
            activity.img = cloudinary_url["url"]

        db.session.commit()

        return jsonify(activity.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_activity(id):
    try:
        current_user_id = get_jwt_identity()
        professional = Professional.query.filter_by(
            user_id=int(current_user_id)).first()

        if not professional:
            return jsonify({"error": "Only professionals can delete activities"}), 403

        activity = Activity.query.filter_by(
            id=id,
            profesional_id=professional.id
        ).first()

        if not activity:
            return jsonify({"error": "Activity not found or not owned by professional"}), 404

        db.session.delete(activity)
        db.session.commit()

        return jsonify({"message": "Activity deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
