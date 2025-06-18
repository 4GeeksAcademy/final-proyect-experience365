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
            web=data['web'],
            description=data['description'],
            image=data['image'],
            facebook=data['facebook'],
            instagram=data['instagram'],
            twitter=data['twitter'],
            linkedin=data['linkedin'],
            is_active=True
        )

        db.session.add(new_professional)
        db.session.commit()

        # Crear token JWT
        access_token = create_access_token(identity={
            "id": new_user.id,
            "email": new_user.email,
            "role": "professional"
        })

        return jsonify({
            "message": "Professional registered successfully",
            "user": new_user.serialize(),
            "professional": new_professional.serialize(),
            "token": access_token
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
