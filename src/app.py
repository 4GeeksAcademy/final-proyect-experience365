"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory


from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.database.db import db
import api.routes.activity as activity_router
import api.routes.payments as payments_router
import api.routes.user as user_router
import api.routes.professional as professional_router
import api.routes.globalrate as globalrate_router
import api.routes.favorite as favorite_router
import api.routes.credentials as credentials_router


from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager


ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configuración de JWT
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY", "my-secret-key")  # Clave cambiada
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(activity_router.api, url_prefix='/api/activity')
app.register_blueprint(payments_router.api, url_prefix='/api/stripe')
app.register_blueprint(user_router.api, url_prefix='/api/user')
app.register_blueprint(professional_router.api, url_prefix='/api/professional')
app.register_blueprint(globalrate_router.api, url_prefix='/api/rating')
app.register_blueprint(favorite_router.api, url_prefix='/api/favorite')
app.register_blueprint(credentials_router.api, url_prefix='/api/credentials')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
