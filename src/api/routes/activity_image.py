from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from flask_cors import CORS
from api.models.Activity import Activity
from api.models.ActivityImage import ActivityImage
from api.models.Professional import Professional
from api.database.db import db
import cloudinary.uploader
import os

api = Blueprint('api_activity_images', __name__)
CORS(api)


@api.route('/<int:activity_id>/images', methods=['GET', 'POST', 'OPTIONS'])
@jwt_required()
def handle_activity_images(activity_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    if request.method == 'POST':
        return upload_images(activity_id)
    elif request.method == 'GET':
        return get_images(activity_id)


def upload_images(activity_id):
    """Maneja la subida de imágenes tanto por archivos como por URLs directas"""
    try:
        # Verificación de usuario y actividad
        current_user_id = get_jwt_identity()
        professional = Professional.query.filter_by(
            user_id=int(current_user_id)).first()
        if not professional:
            return jsonify({"error": "Usuario no autorizado"}), 403

        activity = Activity.query.filter_by(
            id=int(activity_id),
            profesional_id=professional.id
        ).first()
        if not activity:
            return jsonify({"error": "Actividad no encontrada o no autorizada"}), 404

        # Determinar el tipo de contenido
        if request.content_type == 'application/json':
            data = request.get_json()
            if not data or 'urls' not in data:
                return jsonify({"error": "Formato JSON inválido. Se espera {'urls': []}"}), 400

            return process_urls(activity, data['urls'])
        else:
            if 'files' not in request.files:
                return jsonify({"error": "No se proporcionaron archivos"}), 400
            return process_files(activity, request.files.getlist('files'))

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al procesar imágenes",
            "details": str(e)
        }), 500


def process_urls(activity, urls):
    """Procesa y almacena imágenes desde URLs directas"""
    uploaded_urls = []
    is_first_image = activity.img is None

    for img_url in urls:
        if not isinstance(img_url, str) or not img_url.startswith(('http://', 'https://')):
            continue

        new_image = ActivityImage(
            activity_id=activity.id,
            url=img_url
        )
        db.session.add(new_image)

        if is_first_image:
            activity.img = img_url
            is_first_image = False

        uploaded_urls.append({
            "id": new_image.id,
            "url": img_url
        })

    db.session.commit()
    return jsonify({
        "message": "Imágenes subidas desde URLs",
        "images": uploaded_urls,
        "cover_image": activity.img
    }), 201


def process_files(activity, files):
    """Procesa y sube archivos de imágenes a Cloudinary"""
    uploaded_urls = []
    is_first_image = activity.img is None

    for file in files:
        if file.filename == '':
            continue

        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            continue

        upload_result = cloudinary.uploader.upload(
            file,
            folder=f"activities/{activity.id}",
            quality="auto:good"
        )
        img_url = upload_result['secure_url']

        new_image = ActivityImage(
            activity_id=activity.id,
            url=img_url
        )
        db.session.add(new_image)

        if is_first_image:
            activity.img = img_url
            is_first_image = False

        uploaded_urls.append({
            "id": new_image.id,
            "url": img_url
        })

    db.session.commit()
    return jsonify({
        "message": "Imágenes subidas desde archivos",
        "images": uploaded_urls,
        "cover_image": activity.img
    }), 201


def get_images(activity_id):
    """Obtiene todas las imágenes de una actividad"""
    try:
        activity = Activity.query.get_or_404(activity_id)
        images = [{
            "id": img.id,
            "url": img.url,
            "is_cover": (img.url == activity.img)
        } for img in activity.images]

        return jsonify({
            "activity_id": activity_id,
            "images": images,
            "cover_image": activity.img
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Error al obtener imágenes",
            "details": str(e)
        }), 500


@api.route('/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_activity_image(image_id):
    """Elimina una imagen específica"""
    try:
        current_user_id = get_jwt_identity()
        image = ActivityImage.query.get_or_404(image_id)

        # Verificar permisos
        professional = Professional.query.filter_by(
            user_id=int(current_user_id)).first()
        if not professional or image.activity.profesional_id != professional.id:
            return jsonify({"error": "No autorizado"}), 403

        activity = image.activity
        is_cover_image = (image.url == activity.img)

        db.session.delete(image)

        # Si era la imagen principal, buscar una nueva o dejarla como null
        if is_cover_image:
            remaining_images = ActivityImage.query.filter_by(
                activity_id=activity.id).all()
            if remaining_images:
                activity.img = remaining_images[0].url
            else:
                activity.img = None
            db.session.add(activity)

        db.session.commit()

        return jsonify({
            "message": "Imagen eliminada correctamente",
            "new_cover_image": activity.img
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al eliminar imagen",
            "details": str(e)
        }), 500
