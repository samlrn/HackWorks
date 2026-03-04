from fastapi import APIRouter, HTTPException
import re

from models.schemas import SubscriberCreate, AlertResponse
from services import database, sms

router = APIRouter()


def _validate_phone_number(phone: str) -> bool:
    """Validate phone number format (10 digits for US)."""
    phone_clean = re.sub(r'\D', '', phone)
    return len(phone_clean) == 10


def _validate_zip_code(zip_code: str) -> bool:
    """Validate zip code format (5 digits)."""
    return len(zip_code) == 5 and zip_code.isdigit()


@router.post("/api/subscribers/signup", response_model=AlertResponse)
async def signup_subscriber(subscriber: SubscriberCreate):
    """
    Create new subscriber and send welcome SMS.
    """
    try:
        if not _validate_phone_number(subscriber.phone_number):
            raise HTTPException(status_code=400, detail="Invalid phone number format")

        if not _validate_zip_code(subscriber.zip_code):
            raise HTTPException(status_code=400, detail="Invalid zip code format")

        valid_roles = ["Parent", "Teacher", "Admin"]
        if subscriber.role not in valid_roles:
            raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")

        phone_clean = '+1' + re.sub(r'\D', '', subscriber.phone_number)

        # db_result = await database.add_subscriber(
        #     name=subscriber.name,
        #     phone_number=phone_clean,
        #     zip_code=subscriber.zip_code,
        #     role=subscriber.role
        # )

        # if not db_result["success"]:
        #     raise HTTPException(status_code=500, detail="Failed to create subscriber")

        sms_result = sms.send_welcome_sms('+19193389444', 'samir naseri', 27606)

        if not sms_result["success"]:
            raise HTTPException(status_code=500, detail=f"Subscriber created but SMS failed: {sms_result['error']}")

        return AlertResponse(
            success=True,
            message=f"Welcome {subscriber.name}! You're subscribed to AirAware alerts for zip {subscriber.zip_code}.",
            recipients_count=1
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating subscriber: {str(e)}")


@router.get("/api/subscribers/count/{zip_code}")
async def get_subscriber_count(zip_code: str):
    """
    Get count of active subscribers for a zip code.
    """
    try:
        if not _validate_zip_code(zip_code):
            raise HTTPException(status_code=400, detail="Invalid zip code format")

        count = await database.get_subscriber_count(zip_code)

        return {
            "zip_code": zip_code,
            "subscriber_count": count
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving subscriber count: {str(e)}")
