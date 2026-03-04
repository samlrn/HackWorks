from fastapi import APIRouter, HTTPException
from datetime import datetime
import asyncio

from models.schemas import AirQualityDashboardResponse, ForecastItemResponse
from services import airnow, weather, groq_ai, database

router = APIRouter()


@router.get("/api/air-quality/{zip_code}", response_model=AirQualityDashboardResponse)
async def get_air_quality(zip_code: str):
    """
    Get comprehensive air quality data with AI recommendation.
    Combines AQI, weather, forecast, and AI-powered recommendation.
    """
    try:
        aqi_data, weather_data, subscriber_count = await asyncio.gather(
            airnow.get_aqi_data(zip_code),
            weather.get_current_weather(zip_code),
            database.get_subscriber_count(zip_code)
        )

        if aqi_data.get("error"):
            raise HTTPException(status_code=404, detail=aqi_data.get("error"))

        forecast_data = await weather.get_forecast(zip_code)

        forecast_list = [ForecastItemResponse(**item) for item in forecast_data]

        forecast_trend = "stable"
        if forecast_data:
            first_aqi = forecast_data[0].get("aqi_estimate", 50)
            last_aqi = forecast_data[-1].get("aqi_estimate", 50)
            if last_aqi > first_aqi + 10:
                forecast_trend = "worsening"
            elif last_aqi < first_aqi - 10:
                forecast_trend = "improving"

        ai_response = await groq_ai.generate_recommendation(
            aqi=aqi_data["aqi"],
            main_pollutant=aqi_data["main_pollutant"],
            temperature=weather_data["temperature"],
            humidity=weather_data["humidity"],
            wind_speed=weather_data["wind_speed"],
            forecast_trend=forecast_trend
        )

        return AirQualityDashboardResponse(
            zip_code=zip_code,
            aqi=aqi_data["aqi"],
            category=aqi_data["category"],
            color=aqi_data["color"],
            main_pollutant=aqi_data["main_pollutant"],
            pollutant_description=aqi_data["pollutant_description"],
            is_dangerous_for_asthma=aqi_data["is_dangerous_for_asthma"],
            recommendation_level=aqi_data["recommendation_level"],
            ai_recommendation=ai_response["recommendation_text"],
            ai_action=ai_response["action"],
            ai_action_color=ai_response["action_color"],
            weather=weather_data,
            forecast=forecast_list,
            subscriber_count=subscriber_count,
            last_updated=datetime.utcnow().isoformat() + "Z"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving air quality data: {str(e)}")
