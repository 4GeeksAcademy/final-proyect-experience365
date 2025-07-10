from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from api.models.Activity import Activity
from api.models.ActivityImage import ActivityImage
from api.models.Professional import Professional
from api.database.db import db
import cloudinary.uploader
import os

api = Blueprint('api_activity_images', __name__)

@api.route('/<int:activity_id>/images', methods=['POST', 'OPTIONS'])
@jwt_required()
@cross_origin(origins="*", allow_headers=["Content-Type", "Authorization"])
def upload_activity_images(activity_id):
    """
    Sube imágenes para una actividad específica y establece la primera como imagen principal
    """
    try:
        current_user_id = get_jwt_identity()
        professional = Professional.query.filter_by(
            user_id=int(current_user_id)).first()

        if not professional:
            return jsonify({"error": "Usuario no autorizado"}), 403

        # Verificar que el profesional es dueño de la actividad
        activity = Activity.query.filter_by(
            id=int(activity_id),
            profesional_id=professional.id
        ).first()

        if not activity:
            return jsonify({"error": "Actividad no encontrada o no autorizada"}), 404

        if 'files' not in request.files:
            return jsonify({"error": "No se proporcionaron archivos"}), 400

        uploaded_urls = []
        files = request.files.getlist('files')
        is_first_image = True  # Bandera para identificar la primera imagen

        if len(files) == 0:
            return jsonify({"error": "No se seleccionaron archivos válidos"}), 400

        for file in files:
            if file.filename == '':
                continue

            # Validar tipo de archivo
            if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                continue

            # Subir a Cloudinary
            upload_result = cloudinary.uploader.upload(
                file,
                folder=f"activities/{activity_id}",
                quality="auto:good"
            )
            img_url = upload_result['secure_url']

            # Guardar en BD
            new_image = ActivityImage(
                activity_id=activity.id,
                url=img_url
            )
            db.session.add(new_image)
            
            # Establecer la primera imagen como imagen principal (img)
            if is_first_image:
                activity.img = img_url
                db.session.add(activity)
                is_first_image = False
            
            uploaded_urls.append({
                "id": new_image.id,
                "url": img_url
            })

        db.session.commit()
        return jsonify({
            "message": "Imágenes subidas correctamente",
            "images": uploaded_urls,
            "cover_image": activity.img  # Devuelve la imagen principal
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al subir imágenes",
            "details": str(e)
        }), 500

@api.route('/<int:activity_id>/images', methods=['GET'])
@cross_origin()
def get_activity_images(activity_id):
    """
    Obtiene todas las imágenes de una actividad
    """
    try:
        activity = Activity.query.get_or_404(activity_id)
        images = [{
            "id": img.id,
            "url": img.url,
            "is_cover": (img.url == activity.img)  # Indica si es la imagen principal
        } for img in activity.images]

        return jsonify({
            "activity_id": activity_id,
            "images": images,
            "cover_image": activity.img  # Incluye la imagen principal por separado
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Error al obtener imágenes",
            "details": str(e)
        }), 500

@api.route('/<int:image_id>', methods=['DELETE'])
@jwt_required()
@cross_origin(allow_headers=["Authorization"])
def delete_activity_image(image_id):
    """
    Elimina una imagen específica
    Si es la imagen principal (img), actualiza el campo a la siguiente disponible o null
    """
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

        # Eliminar de Cloudinary (opcional)
        # cloudinary.uploader.destroy(...)

        db.session.delete(image)

        # Si era la imagen principal, buscar una nueva o dejarla como null
        if is_cover_image:
            remaining_images = ActivityImage.query.filter_by(
                activity_id=activity.id
            ).all()
            
            if remaining_images:
                activity.img = remaining_images[0].url
            else:
                activity.img = None
            
            db.session.add(activity)

        db.session.commit()

        return jsonify({
            "message": "Imagen eliminada correctamente",
            "new_cover_image": activity.img  # Informa la nueva imagen principal
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al eliminar imagen",
            "details": str(e)
        }), 500