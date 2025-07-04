"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import stripe
import os
from flask_cors import CORS
from api.database.db import db
from api.models.Payments import Payments

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')

api = Blueprint('/api/stripe', __name__)

CORS(api)

# creating checkout session to send data to stripe


@api.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    frontend_url = os.getenv('VITE_FRONTEND_URL')
    unit_amount = int(data['amount'])
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'eur',
                        'unit_amount': unit_amount,
                        'product_data': {
                            'name': data.get('product_name', 'Actividad')
                        }
                    },
                    'quantity': 1,
                }
            ],
            mode='payment',
            success_url=f'{frontend_url}/payment/checkout-result/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{frontend_url}/payment/checkout-result/cancel'
        )

        payment = Payments(
            user_id=current_user_id,
            activity_id=data['activity_id'],
            stripe_session_id=checkout_session.id,
            status='pending',
            amount=int(data['amount'])
        )
        db.session.add(payment)
        db.session.commit()

        return jsonify({'url': checkout_session.url})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


@api.route('/session-status', methods=['POST'])
def check_session_status():
    try:
        data = request.get_json()
        session_id = data.get('session_id')

        if not session_id:
            return jsonify({'error': 'session_id es requerido'}), 400

        session = stripe.checkout.Session.retrieve(session_id)
        payment = Payments.query.filter_by(
            stripe_session_id=session_id).first()

        if not payment:
            return jsonify({'error': 'Pago no encontrado en la base de datos'}), 404

        return jsonify({
            'payment_status': payment.status,
            'stripe_status': session.get('payment_status', 'desconocido'),
            'amount': payment.amount,
            'activity_id': payment.activity_id,
            'user_id': payment.user_id,
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@api.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            session_id = session['id']

            # Buscar el pago creado previamente
            payment = Payments.query.filter_by(
                stripe_session_id=session_id).first()

            if payment:
                payment.status = 'completed'
                db.session.commit()
                print(
                    f" Pago confirmado: usuario {payment.user_id}, actividad {payment.activity_id}")
            else:
                print(
                    f"Sesión recibida pero no encontrada en BD: {session_id}")

        return '', 200

    except Exception as e:
        print(f'Error en webhook: {str(e)}')
        return '', 400
