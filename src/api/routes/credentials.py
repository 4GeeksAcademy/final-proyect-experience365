from flask import Blueprint, request, jsonify
from api.models.User import User
from api.database.db import db
from itsdangerous import URLSafeTimedSerializer
import os
import smtplib
from email.mime.text import MIMEText
from flask_cors import CORS

api = Blueprint('/api/credentials', __name__)
CORS(api)

# Inicializamos el serializer con la clave secreta
serializer = URLSafeTimedSerializer(os.getenv('FLASK_APP_KEY', 'default-key'))


def send_email(to_email, subject, html_content):
    msg = MIMEText(html_content, "html")
    msg["Subject"] = subject
    # msg["From"] = os.getenv("GMAIL_USER")
    msg["From"] = "experience365team@gmail.com"
    msg["To"] = to_email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        # server.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_PASSWORD"))
        server.login("morellans@gmail.com", "wehf aaul zhgr zqqs")
        server.send_message(msg)


@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        # No revelar si existe o no por seguridad
        return jsonify({"message": "If the email exists, a reset link has been sent"}), 200

    token = serializer.dumps(user.id, salt="reset-password")
    frontend_url = os.getenv("VITE_FRONTEND_URL", "http://localhost:3000")
    link = f"{frontend_url}/reset-password?token={token}"

    html_content = f"""
        <p>Hola {user.email},</p>
        <p>Haz clic en el enlace para restablecer tu contraseña:</p>
        <p><a href="{link}">{link}</a></p>
    """

    send_email(
        to_email=user.email,
        subject="Restablece tu contraseña",
        html_content=html_content
    )

    return jsonify({"message": "If the email exists, a reset link has been sent"}), 200


@api.route('/confirm-reset-password', methods=['POST'])
def confirm_reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    try:
        user_id = serializer.loads(token, salt="reset-password", max_age=3600)
    except Exception as e:
        return jsonify({"error": "Invalid or expired token"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200
