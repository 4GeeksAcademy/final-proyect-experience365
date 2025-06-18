"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.database.db import db
from api.models.User import User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
api = Blueprint('/api/user', __name__)
# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    # Validación básica
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400
    # Verificar si el usuario ya existe
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 409
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
        db.session.commit()
        # Crear token JWT
        access_token = create_access_token(identity={
            "id": new_user.id,
            "email": new_user.email
        })
        return jsonify({
            "message": "User registered successfully",
            "user": new_user.serialize()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
