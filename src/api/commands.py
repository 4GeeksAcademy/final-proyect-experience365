import click
import json
import requests
import os

from api.database.db import db
from api.models.User import User
from api.models.Professional import Professional
from api.models.Activity import Activity
from api.models.Payments import Payments


"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def setup_commands(app):
    """
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")
        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        # Cambia si usas otro puerto
        base_url = os.getenv("VITE_BACKEND_URL", "http://localhost:3001")
        headers = {"Content-Type": "application/json"}

        try:
            with open("src/api/data/test_data.json", "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error cargando test_data.json: {e}")
            return

        for prof in data:
            # Crear usuario
            requests.post(
                f"{base_url}/api/professional/register",
                json={
                    "email": prof["email"],
                    "password": prof["password"],
                    "name": prof["name"],
                    "lastname": prof["lastname"],
                    "cif": prof["cif"],
                    "adress": prof["adress"],
                    "phone": prof["phone"],
                    "description": prof["description"]
                },
                headers=headers
            )
            print(f"Usuario creado: {prof['email']}")

            # Login para obtener token
            r = requests.post(
                f"{base_url}/api/user/login",
                json={"email": prof["email"], "password": prof["password"]},
                headers=headers
            )

            if r.status_code != 200:
                print(f"Login fallido para {prof['email']}")
                continue

            token = r.json().get("access_token")
            if not token:
                print(f"No se recibió token para {prof['email']}")
                print(f"Token", token)
                continue

            auth_headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }

            for act in prof.get("activities", []):
                form_data = {
                    "name": act["name"],
                    "description": act["description"],
                    "price": str(act["price"]),  # asegúrate de que sea string
                    # valor por defecto si no hay
                    "duration": str(act.get("duration", "1:00")),
                    "img": act["image"]

                }

                r = requests.post(
                    f"{base_url}/api/activity",
                    data=form_data,
                    headers={"Authorization": f"Bearer {token}"}
                )

                if r.status_code in (200, 201):
                    print(f"Actividad creada: {act['name']}")
                else:
                    print(f"Error creando actividad: {r.text}")
