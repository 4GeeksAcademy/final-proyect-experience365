"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.database.db import db
from api.models.User import User
from api.models.Professional import Professional
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('/api/professional', __name__)
# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def register_professional():
    data = request.get_json()

    # Campos obligatorios
    required_fields = ['email', 'password',
                       'name', 'lastname', 'cif',
                       'adress', 'phone']

    # Verifica que el objeto JSON tenga los campos obligatorios
    missing_fields = [
        field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Validación básica
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    # Verificar si el usuario ya existe
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400

    # Verificar si el CIF ya existe
    if Professional.query.filter_by(cif=data['cif']).first():
        return jsonify({"error": "CIF already exists"}), 400

    # Crear nuevo usuario
    new_user = User(
        email=data['email'],
        name=data.get('name'),
        lastname=data.get('lastname'),
        is_active=True
    )
    # Encriptar contraseña
    new_user.set_password(data['password'])

    try:
        db.session.add(new_user)
        db.session.flush()

        # Crear profesional
        new_professional = Professional(
            user_id=new_user.id,
            cif=data['cif'],
            adress=data['adress'],
            phone=data['phone'],
            web=data.get('web', ''),
            description=data.get('description', ''),
            image=data.get('image', ''),
            facebook=data.get('facebook', ''),
            instagram=data.get('instagram', ''),
            twitter=data.get('twitter', ''),
            linkedin=data.get('linkedin', ''),
            is_active=True
        )

        db.session.add(new_professional)
        db.session.commit()

        return jsonify({
            "message": "Professional registered successfully",
            "user": new_user.serialize(),
            "professional": new_professional.serialize(),

        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route('/professional/me', methods=['PUT'])
@jwt_required()
def update_professional():
    current_user_id = int(get_jwt_identity())

    # Obtener usuario y perfil de profesional
    user = User.query.get(current_user_id)
    professional = Professional.query.filter_by(user_id=current_user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404
    if not professional:
        return jsonify({"error": "Professional profile not found"}), 404

    data = request.get_json()

    # Actualizar campos del usuario
    user.name = data.get("name", user.name)
    user.lastname = data.get("lastname", user.lastname)
    user.email = data.get("email", user.email)

    # Actualizar campos del profesional
    professional.cif = data.get("cif", professional.cif)
    professional.adress = data.get("adress", professional.adress)
    professional.phone = data.get("phone", professional.phone)
    professional.web = data.get("web", professional.web)
    professional.description = data.get("description", professional.description)
    professional.image = data.get("image", professional.image)
    professional.facebook = data.get("facebook", professional.facebook)
    professional.instagram = data.get("instagram", professional.instagram)
    professional.twitter = data.get("twitter", professional.twitter)
    professional.linkedin = data.get("linkedin", professional.linkedin)

    if data.get('password'):
        user.set_password(data['password'])

    try:
        db.session.commit()
        return jsonify({
            "message": "Professional profile updated successfully",
            "user": user.serialize(),
            "professional": professional.serialize()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500