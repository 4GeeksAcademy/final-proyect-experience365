import click
import json
import requests
import os
from api.database.db import db
from api.models.User import User
from api.models.Professional import Professional
from api.models.Activity import Activity
from api.models.Payments import Payments

def setup_commands(app):
    @app.cli.command("insert-test-users")
    @click.argument("count")
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
        base_url = os.getenv("VITE_BACKEND_URL", "http://localhost:3001")
        headers = {"Content-Type": "application/json"}

        try:
            with open("src/api/data/test_data.json", "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error cargando test_data.json: {e}")
            return

        for prof in data:
            # Crear usuario profesional
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
                    "description": prof["description"],
                    "image": prof["image"],
                    "facebook": prof["facebook"],
                    "instagram": prof["instagram"],
                    "twitter": prof["twitter"],
                    "linkedin": prof["linkedin"],
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
                continue

            # Crear actividades
            for act in prof.get("activities", []):
                # Crear actividad principal
                activity_data = {
                    "name": act["name"],
                    "description": act["description"],
                    "city": act["city"],
                    "price": str(act["price"]),
                    "duration": str(act.get("duration", "1:00")),
                    "img": act["image"]
                }

                r = requests.post(
                    f"{base_url}/api/activity",
                    data=activity_data,
                    headers={"Authorization": f"Bearer {token}"}
                )

                if r.status_code not in (200, 201):
                    print(f"Error creando actividad: {r.text}")
                    continue

                activity_id = r.json().get("id")
                print(f"Actividad creada: {act['name']} (ID: {activity_id})")

                # Subir imágenes adicionales si existen
                if "activity_images" in act and activity_id and act["activity_images"]:
                    print(f"Subiendo imágenes adicionales para actividad {activity_id}")
                    
                    try:
                        response = requests.post(
                            f"{base_url}/api/activity_images/{activity_id}/images",
                            json={"urls": act["activity_images"]},
                            headers={
                                "Authorization": f"Bearer {token}",
                                "Content-Type": "application/json"
                            }
                        )
                        
                        if response.status_code == 201:
                            print(f"{len(act['activity_images'])} imágenes subidas correctamente")
                        else:
                            print(f"Error subiendo imágenes: {response.status_code} - {response.text}")
                    except Exception as e:
                        print(f"Error en el proceso de subida: {str(e)}")