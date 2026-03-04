import os
import asyncio
from supabase import create_client, Client
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor

_supabase_client: Optional[Client] = None
_executor = ThreadPoolExecutor(max_workers=5)

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
        def _insert():
            client = _get_supabase_client()
            data = {
                "name": name,
                "phone_number": phone_number,
                "zip_code": zip_code,
                "role": role,
                "active": True
            }
            result = client.table("subscribers").insert(data).execute()
            return result

        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(_executor, _insert)

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
        print(f"Error adding subscriber: {str(e)}")
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
        def _query():
            client = _get_supabase_client()
            result = client.table("subscribers").select("*").eq("zip_code", zip_code).eq("active", True).execute()
            return result.data if result.data else []

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(_executor, _query)

    except Exception as e:
        print(f"Error fetching subscribers: {str(e)}")
        return []


async def get_all_active_zip_codes() -> List[str]:
    """
    Get list of all unique zip codes with active subscribers.
    """
    try:
        def _query():
            client = _get_supabase_client()
            result = client.table("subscribers").select("zip_code").eq("active", True).execute()
            return list(set([row["zip_code"] for row in (result.data if result.data else []) if row.get("zip_code")]))

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(_executor, _query)

    except Exception as e:
        print(f"Error fetching zip codes: {str(e)}")
        return []


async def log_alert(zip_code: str, aqi_value: int, alert_message: str, recipients_count: int) -> dict:
    """
    Log an alert event to the database.
    """
    try:
        def _insert():
            client = _get_supabase_client()
            data = {
                "zip_code": zip_code,
                "aqi_value": aqi_value,
                "alert_message": alert_message,
                "recipients_count": recipients_count
            }
            result = client.table("alert_log").insert(data).execute()
            return result

        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(_executor, _insert)

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
        print(f"Error logging alert: {str(e)}")
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
        def _count():
            client = _get_supabase_client()
            result = client.table("subscribers").select("id", count="exact").eq("zip_code", zip_code).eq("active", True).execute()
            return result.count if result.count is not None else 0

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(_executor, _count)

    except Exception as e:
        print(f"Error counting subscribers: {str(e)}")
        return 0
