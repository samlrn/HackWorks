from pydantic import BaseModel, Field
from typing import Optional, List

class SubscriberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone_number: str = Field(..., min_length=10, max_length=15)
    zip_code: str = Field(..., min_length=5, max_length=5)
    role: str = Field(..., description="Role: Parent, Teacher, or Admin")


class SubscriberResponse(BaseModel):
    id: str
    created_at: str
    name: str
    phone_number: str
    zip_code: str
    role: str
    active: bool


class WeatherResponse(BaseModel):
    temperature: float
    feels_like: float
    humidity: int
    wind_speed: float
    wind_direction: str
    description: str
    icon: str
    error: Optional[str] = None


class ForecastItemResponse(BaseModel):
    time: str
    aqi_estimate: int
    temperature: float
    description: str


class AQIResponse(BaseModel):
    aqi: int
    category: str
    color: str
    main_pollutant: str
    pollutant_description: str
    is_dangerous_for_asthma: bool
    recommendation_level: str
    error: Optional[str] = None


class RecommendationResponse(BaseModel):
    recommendation_text: str
    action: str
    action_color: str
    error: Optional[str] = None


class AlertTriggerRequest(BaseModel):
    zip_code: str = Field(..., min_length=5, max_length=5)
    override_aqi: Optional[int] = Field(None, description="Optional AQI override for demo mode")


class AirQualityDashboardResponse(BaseModel):
    zip_code: str
    aqi: int
    category: str
    color: str
    main_pollutant: str
    pollutant_description: str
    is_dangerous_for_asthma: bool
    recommendation_level: str
    ai_recommendation: str
    ai_action: str
    ai_action_color: str
    weather: WeatherResponse
    forecast: List[ForecastItemResponse]
    subscriber_count: int
    last_updated: str


class AlertResponse(BaseModel):
    success: bool
    message: str
    recipients_count: int
    error: Optional[str] = None


class HealthCheckResponse(BaseModel):
    status: str
