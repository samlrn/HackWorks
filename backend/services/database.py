import os
from supabase import create_client, Client
from typing import List, Dict, Optional

_supabase_client: Optional[Client] = None

def _get_supabase_client() -> Client:
    """Initialize and return Supabase client."""
    global _supabase_client
    if _supabase_client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Supabase credentials not configured")
        _supabase_client = create_client(url, key)
    return _supabase_client


async def add_subscriber(name: str, phone_number: str, zip_code: str, role: str) -> dict:
    """
    Add a new subscriber to the database.
    """
    try:
        client = _get_supabase_client()

        data = {
            "name": name,
            "phone_number": phone_number,
            "zip_code": zip_code,
            "role": role,
            "active": True
        }

        result = client.table("subscribers").insert(data).execute()

        if result.data and len(result.data) > 0:
            return {
                "success": True,
                "subscriber": result.data[0],
                "error": None
            }
        else:
            return {
                "success": False,
                "subscriber": None,
                "error": "Failed to create subscriber"
            }

    except Exception as e:
        return {
            "success": False,
            "subscriber": None,
            "error": f"Database error: {str(e)}"
        }


async def get_subscribers_by_zip(zip_code: str) -> List[dict]:
    """
    Get all active subscribers for a given zip code.
    """
    try:
        client = _get_supabase_client()

        result = client.table("subscribers").select("*").eq("zip_code", zip_code).eq("active", True).execute()

        return result.data if result.data else []

    except Exception as e:
        print(f"Error fetching subscribers: {str(e)}")
        return []


async def get_all_active_zip_codes() -> List[str]:
    """
    Get list of all unique zip codes with active subscribers.
    """
    try:
        client = _get_supabase_client()

        result = client.table("subscribers").select("zip_code").eq("active", True).execute()

        zip_codes = list(set([row["zip_code"] for row in result.data if row.get("zip_code")]))
        return zip_codes

    except Exception as e:
        print(f"Error fetching zip codes: {str(e)}")
        return []


async def log_alert(zip_code: str, aqi_value: int, alert_message: str, recipients_count: int) -> dict:
    """
    Log an alert event to the database.
    """
    try:
        client = _get_supabase_client()

        data = {
            "zip_code": zip_code,
            "aqi_value": aqi_value,
            "alert_message": alert_message,
            "recipients_count": recipients_count
        }

        result = client.table("alert_log").insert(data).execute()

        if result.data and len(result.data) > 0:
            return {
                "success": True,
                "alert_log": result.data[0],
                "error": None
            }
        else:
            return {
                "success": False,
                "alert_log": None,
                "error": "Failed to log alert"
            }

    except Exception as e:
        return {
            "success": False,
            "alert_log": None,
            "error": f"Database error: {str(e)}"
        }


async def get_subscriber_count(zip_code: str) -> int:
    """
    Get count of active subscribers for a given zip code.
    """
    try:
        client = _get_supabase_client()

        result = client.table("subscribers").select("id", count="exact").eq("zip_code", zip_code).eq("active", True).execute()

        return result.count if result.count is not None else 0

    except Exception as e:
        print(f"Error counting subscribers: {str(e)}")
        return 0
