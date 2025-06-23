from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Flask, request, jsonify, url_for, Blueprint
from api.database.db import db
from api.models.Activity import Activity
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from api.models.Professional import Professional
import os

# cloudinary
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
    activities = Activity.query.all()
    return jsonify([a.serialize() for a in activities]), 200


@api.route('/', methods=['POST'])
@jwt_required()
def create_activity():
    current_user_id = get_jwt_identity()
    print("current_user_id", current_user_id)
    print(type(current_user_id))
    professional = Professional.query.filter_by(
        user_id=int(current_user_id)).first()
    print("professional", professional)
    if not professional:
        return jsonify({"error": "Only professionals can create activities"}), 403

    description = request.form.get('description')
    price = request.form.get('price')
    duration = request.form.get('duration')
    
    print("duration", type(duration))

    
    img_url = None

    if "file" in request.files:
        file = request.files["file"]
        cloudinary_url = cloudinary.uploader.upload(file)
        img_url = cloudinary_url["url"]
    print("img_url", img_url)

    new_activity = Activity(
        profesional_id=professional.id,
        description=description,
        price=price,
        rate=None,
        img=img_url,
        is_active=True,
        activity_date = duration

    )
    db.session.add(new_activity)
    db.session.commit()
    return jsonify(new_activity.serialize()), 201


@api.route('/<int:id>', methods=['GET'])
def get_activity(id):
    activity = Activity.query.get_or_404(id)
    return jsonify(activity.serialize()), 200


@api.route('/img', methods=['POST'])
def upload_img():
    img = request.files["img"]
    img_url = cloudinary.uploader.upload(img)
    return jsonify({"img": img_url["url"]}), 200
