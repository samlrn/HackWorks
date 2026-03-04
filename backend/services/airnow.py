import os
import httpx
from typing import Optional

async def get_aqi_data(zip_code: str) -> dict:
    """
    Fetch current AQI data from AirNow API for a given zip code.
    Returns comprehensive AQI information with color, category, and health recommendations.
    """
    try:
        api_key = os.getenv("AIRNOW_API_KEY")
        if not api_key:
            return _error_response("AirNow API key not configured")

        url = "https://www.airnowapi.org/aq/observation/zipCode/current/"
        params = {
            "format": "application/json",
            "zipCode": zip_code,
            "distance": 25,
            "API_KEY": api_key
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()

        data = response.json()

        if not data:
            return _error_response(f"No AQI data found for zip code {zip_code}")

        observation = data[0]
        aqi = observation.get("AQI", 0)
        main_pollutant = observation.get("MainPollutant", "PM2.5")

        category = _get_aqi_category(aqi)
        color = _get_aqi_color(aqi)
        pollutant_description = _get_pollutant_description(main_pollutant)
        recommendation_level = _get_recommendation_level(aqi)
        is_dangerous_for_asthma = aqi > 100

        return {
            "aqi": aqi,
            "category": category,
            "color": color,
            "main_pollutant": main_pollutant,
            "pollutant_description": pollutant_description,
            "recommendation_level": recommendation_level,
            "is_dangerous_for_asthma": is_dangerous_for_asthma,
            "error": None
        }

    except httpx.TimeoutException:
        return _error_response("AirNow API request timed out")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return _error_response(f"Zip code {zip_code} not found in AirNow database")
        elif e.response.status_code == 429:
            return _error_response("AirNow API rate limit exceeded")
        else:
            return _error_response(f"AirNow API error: {e.response.status_code}")
    except Exception as e:
        return _error_response(f"Failed to fetch AQI data: {str(e)}")


def _get_aqi_category(aqi: int) -> str:
    """Map AQI value to category label."""
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Moderate"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    elif aqi <= 200:
        return "Unhealthy"
    else:
        return "Very Unhealthy"


def _get_aqi_color(aqi: int) -> str:
    """Map AQI value to hex color code."""
    if aqi <= 50:
        return "#00E400"  # Green
    elif aqi <= 100:
        return "#FFFF00"  # Yellow
    elif aqi <= 150:
        return "#FF7E00"  # Orange
    elif aqi <= 200:
        return "#FF0000"  # Red
    else:
        return "#8F3F97"  # Purple


def _get_recommendation_level(aqi: int) -> str:
    """Map AQI value to recommendation level."""
    if aqi <= 50:
        return "SAFE"
    elif aqi <= 100:
        return "CAUTION"
    else:
        return "DANGER"


def _get_pollutant_description(pollutant: str) -> str:
    """Get plain English description of pollutant and its health effects."""
    descriptions = {
        "PM2.5": "Fine particles from traffic and industrial emissions — most dangerous for asthma sufferers",
        "PM10": "Coarse dust particles that irritate airways",
        "O3": "Ground-level ozone from sunlight reacting with pollution",
        "NO2": "Nitrogen dioxide from vehicle exhaust",
        "CO": "Carbon monoxide from combustion",
        "SO2": "Sulfur dioxide from industrial sources"
    }
    return descriptions.get(pollutant, f"{pollutant} affects air quality and respiratory health")


def _error_response(error_msg: str) -> dict:
    """Return a standardized error response."""
    return {
        "aqi": 0,
        "category": "Unknown",
        "color": "#CCCCCC",
        "main_pollutant": "Unknown",
        "pollutant_description": "Unable to fetch air quality data",
        "recommendation_level": "UNKNOWN",
        "is_dangerous_for_asthma": False,
        "error": error_msg
    }
