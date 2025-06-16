"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.database.db import db
from api.models.User import User
from api.models.Professional import Professional
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/user', methods=['GET'])
def user():
    user = User.query.all()
    return jsonify([u.serialize() for u in user]), 200


@api.route('/professional', methods=['GET'])
def professional():
    professional = Professional.query.all()
    return jsonify([p.serialize() for p in professional]), 200
