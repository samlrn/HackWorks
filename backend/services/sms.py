import os
from twilio.rest import Client
from typing import List

_twilio_client = None

def _get_twilio_client():
    """Initialize and return Twilio client."""
    global _twilio_client
    if _twilio_client is None:
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        if not account_sid or not auth_token:
            raise ValueError("Twilio credentials not configured")
        _twilio_client = Client(account_sid, auth_token)
    return _twilio_client


def send_welcome_sms(phone: str, name: str, zip_code: str) -> dict:
    """
    Send welcome SMS to new subscriber.
    """
    try:
        client = _get_twilio_client()
        twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")

        message_body = f"Hi {name}! You're now subscribed to AirAware alerts for zip code {zip_code}. You'll receive notifications when air quality becomes dangerous for children with asthma. Reply STOP to unsubscribe. - AirAware NC"

        message = client.messages.create(
            body=message_body,
            from_=twilio_phone,
            to=phone
        )

        return {
            "success": True,
            "message_sid": message.sid,
            "error": None
        }

    except Exception as e:
        return {
            "success": False,
            "message_sid": None,
            "error": f"Failed to send welcome SMS: {str(e)}"
        }


def send_alert_sms(phone: str, zip_code: str, aqi: int, action: str) -> dict:
    """
    Send air quality alert SMS to subscriber.
    """
    try:
        client = _get_twilio_client()
        twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")

        message_body = f"⚠️ AIRAWARE ALERT: Air quality in {zip_code} has reached AQI {aqi} — UNHEALTHY for children with asthma. Recommendation: {action}. Check your school dashboard for details. Reply STOP to unsubscribe."

        message = client.messages.create(
            body=message_body,
            from_=twilio_phone,
            to=phone
        )

        return {
            "success": True,
            "message_sid": message.sid,
            "error": None
        }

    except Exception as e:
        return {
            "success": False,
            "message_sid": None,
            "error": f"Failed to send alert SMS: {str(e)}"
        }


def send_bulk_alerts(zip_code: str, aqi: int, action: str, subscribers: List[dict]) -> dict:
    """
    Send alerts to multiple subscribers for a zip code.
    Returns count of successfully sent messages.
    """
    sent_count = 0
    failed_count = 0
    failed_phones = []

    for subscriber in subscribers:
        phone = subscriber.get("phone_number")
        if not phone:
            failed_count += 1
            continue

        result = send_alert_sms(phone, zip_code, aqi, action)
        if result["success"]:
            sent_count += 1
        else:
            failed_count += 1
            failed_phones.append(phone)

    return {
        "sent_count": sent_count,
        "failed_count": failed_count,
        "failed_phones": failed_phones,
        "total_recipients": len(subscribers),
        "error": None if failed_count == 0 else f"Failed to send to {failed_count} recipients"
    }
