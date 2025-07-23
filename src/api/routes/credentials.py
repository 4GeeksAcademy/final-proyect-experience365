from flask import Blueprint, request, jsonify
from api.models.User import User
from api.database.db import db
from itsdangerous import URLSafeTimedSerializer
from flask_cors import CORS
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage


api = Blueprint('/api/credentials', __name__)
CORS(api)

# Inicializamos el serializer con la clave secreta
serializer = URLSafeTimedSerializer(os.getenv('FLASK_APP_KEY', 'default-key'))


def send_email_with_inline_image(to_email, subject, html_content):
    msg = MIMEMultipart('related')
    msg['Subject'] = subject
    msg['From'] = os.getenv("GMAIL_USER")
    msg['To'] = to_email

    # Parte alternativa para HTML
    msg_alt = MIMEMultipart('alternative')
    msg.attach(msg_alt)

    part_html = MIMEText(html_content, 'html')
    msg_alt.attach(part_html)

    # Adjunta la imagen
    # with open(image_path, 'rb') as img:
    #     mime_img = MIMEImage(img.read())
    #     mime_img.add_header('Content-ID', '<logo_image>')
    #     mime_img.add_header('Content-Disposition',
    #                         'inline', filename='logo.png')
    #     msg.attach(mime_img)

    # Envía el correo
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_PASSWORD"))
        server.send_message(msg)


@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    current_email = data.get("email")

    if not current_email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=current_email).first()

    # No revelar si existe o no por seguridad
    if not user:
        return jsonify({"message": "If the email exists, a reset link has been sent"}), 200

    # Genera token y enlace
    token = serializer.dumps(user.id, salt="reset-password")
    frontend_url = os.getenv("VITE_FRONTEND_URL", "http://localhost:3000")
    link = f"{frontend_url}/reset-password?token={token}"

    # Construye el HTML del correo
    html_content = f"""
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="style="background: white; color: #333; padding: 20px; font-family: Arial, sans-serif; color: white;">
            <tr>
            <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" style="  background: linear-gradient(180deg, rgba(12, 87, 117, 1) 0%, rgba(42, 123, 155, 1) 33%, rgba(87, 199, 133, 0.92) 63%, rgba(237, 221, 83, 0.74) 89%, rgba(255, 255, 255, 0) 100%);">
                <tr>
                <td align="center">
                    <img src="https://res.cloudinary.com/dftas91qh/image/upload/v1753298222/logo_e365_dsnmvn.png" alt="Logo" width="120" />
                    <h2 style="color: white;">Restablece tu contraseña</h2>
                    <p style="color: white;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú quien la solicitó, haz clic en el siguiente botón para crear una nueva contraseña:</p>
                    <br>
                    <p>
                    <a href="{link}" style="background-color: #ff5a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px;">Restablecer contraseña</a>
                    </p>
                    <br>
                    <p style="color: white;">O si prefieres, copia y pega este enlace en tu navegador:</p>
                    <p><a href="{link}">{link}</a></p>
                    <br>
                    <hr style="border: none; border-top: 1px solid #ddd;" />
                    <p style="font-size: 12px; color: white;">Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje. Tu cuenta seguirá siendo segura.</p>
                </td>
                </tr>
            </table>
            </td>
            </tr>
        </table>
    """

    # Llama a la función para enviar el correo
    send_email_with_inline_image(
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
