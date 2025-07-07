from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import Activity, ActivityImage, Professional
from api.database.db import db
import cloudinary.uploader
import os

api = Blueprint('api/activity_images', __name__)

# POST /api/activities/<activity_id>/images
@api.route('/<int:activity_id>/images', methods=['POST'])
@jwt_required()
def upload_activity_images(activity_id):
    current_user_id = get_jwt_identity()
    professional = Professional.query.filter_by(user_id=current_user_id).first()
    
    # Verificar que el profesional es dueño de la actividad
    activity = Activity.query.filter_by(
        id=activity_id, 
        profesional_id=professional.id
    ).first_or_404()

    if 'files' not in request.files:
        return jsonify({"error": "No files provided"}), 400

    uploaded_urls = []
    files = request.files.getlist('files')

    for file in files:
        if file.filename == '':
            continue
        
        # Subir a Cloudinary
        upload_result = cloudinary.uploader.upload(file)
        img_url = upload_result['url']

        # Guardar en BD
        new_image = ActivityImage(
            activity_id=activity.id,
            url=img_url
        )
        db.session.add(new_image)
        uploaded_urls.append(img_url)

    db.session.commit()
    return jsonify({"images": uploaded_urls}), 201

# GET /api/activities/<activity_id>/images
@api.route('/<int:activity_id>/images', methods=['GET'])
def get_activity_images(activity_id):
    activity = Activity.query.get_or_404(activity_id)
    return jsonify([img.serialize() for img in activity.images]), 200