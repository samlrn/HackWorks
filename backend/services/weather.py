import os
import httpx
from datetime import datetime
from typing import List, Dict

async def get_current_weather(zip_code: str) -> dict:
    """
    Fetch current weather data from OpenWeatherMap API.
    Returns temperature, feels like, humidity, wind speed, and description.
    """
    try:
        api_key = os.getenv("OPENWEATHER_API_KEY")
        if not api_key:
            return _error_weather_response("OpenWeatherMap API key not configured")

        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "zip": f"{zip_code},us",
            "appid": api_key,
            "units": "imperial"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()

        data = response.json()

        weather = data.get("main", {})
        wind = data.get("wind", {})
        weather_desc = data.get("weather", [{}])[0]

        temperature = weather.get("temp", 0)
        feels_like = weather.get("feels_like", 0)
        humidity = weather.get("humidity", 0)
        wind_speed = wind.get("speed", 0)
        wind_deg = wind.get("deg", 0)
        description = weather_desc.get("main", "Clear")
        icon = weather_desc.get("icon", "01d")

        wind_direction = _get_wind_direction(wind_deg)

        return {
            "temperature": round(temperature, 1),
            "feels_like": round(feels_like, 1),
            "humidity": humidity,
            "wind_speed": round(wind_speed, 1),
            "wind_direction": wind_direction,
            "description": description,
            "icon": icon,
            "error": None
        }

    except httpx.TimeoutException:
        return _error_weather_response("Weather API request timed out")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return _error_weather_response(f"Zip code {zip_code} not found")
        elif e.response.status_code == 429:
            return _error_weather_response("Weather API rate limit exceeded")
        else:
            return _error_weather_response(f"Weather API error: {e.response.status_code}")
    except Exception as e:
        return _error_weather_response(f"Failed to fetch weather data: {str(e)}")


async def get_forecast(zip_code: str) -> List[dict]:
    """
    Fetch 5-day forecast from OpenWeatherMap and return next 8 items (24 hours, 3-hour intervals).
    Estimates AQI based on temperature, humidity, and wind speed.
    """
    try:
        api_key = os.getenv("OPENWEATHER_API_KEY")
        if not api_key:
            return [_error_forecast_item("API key not configured")]

        url = "https://api.openweathermap.org/data/2.5/forecast"
        params = {
            "zip": f"{zip_code},us",
            "appid": api_key,
            "units": "imperial"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()

        data = response.json()
        forecasts = data.get("list", [])[:8]

        forecast_items = []
        for item in forecasts:
            timestamp = item.get("dt", 0)
            dt = datetime.fromtimestamp(timestamp)
            time_str = dt.strftime("%-I %p").lstrip("0") if dt.hour % 12 != 0 else "12 PM" if dt.hour >= 12 else "12 AM"

            main = item.get("main", {})
            temperature = main.get("temp", 0)
            humidity = main.get("humidity", 0)
            wind = item.get("wind", {})
            wind_speed = wind.get("speed", 0)
            description = item.get("weather", [{}])[0].get("main", "Clear")

            aqi_estimate = _estimate_aqi(temperature, humidity, wind_speed)

            forecast_items.append({
                "time": time_str,
                "aqi_estimate": aqi_estimate,
                "temperature": round(temperature, 1),
                "description": description
            })

        return forecast_items

    except httpx.TimeoutException:
        return [_error_forecast_item("Forecast API timed out")]
    except httpx.HTTPStatusError as e:
        return [_error_forecast_item(f"Forecast API error: {e.response.status_code}")]
    except Exception as e:
        return [_error_forecast_item(f"Failed to fetch forecast: {str(e)}")]


def _get_wind_direction(degrees: int) -> str:
    """Convert wind degree to compass direction."""
    directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    index = round(degrees / 22.5) % 16
    return directions[index]


def _estimate_aqi(temperature: float, humidity: int, wind_speed: float) -> int:
    """
    Estimate AQI based on weather conditions.
    Base AQI of 45, adjusted by temperature, humidity, and wind speed.
    """
    base_aqi = 45

    if humidity > 80:
        base_aqi += 15

    if wind_speed < 5:
        base_aqi += 10

    if temperature > 90:
        base_aqi += 20

    return min(200, max(0, base_aqi))


def _error_weather_response(error_msg: str) -> dict:
    """Return a standardized error response for current weather."""
    return {
        "temperature": 0,
        "feels_like": 0,
        "humidity": 0,
        "wind_speed": 0,
        "wind_direction": "N",
        "description": "Unknown",
        "icon": "01d",
        "error": error_msg
    }


def _error_forecast_item(error_msg: str) -> dict:
    """Return a standardized error response for forecast item."""
    return {
        "time": "N/A",
        "aqi_estimate": 0,
        "temperature": 0,
        "description": "Unavailable",
        "error": error_msg
    }
