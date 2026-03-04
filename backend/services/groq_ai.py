import os
from groq import Groq

async def generate_recommendation(
    aqi: int,
    main_pollutant: str,
    temperature: float,
    humidity: int,
    wind_speed: float,
    forecast_trend: str
) -> dict:
    """
    Generate AI-powered recommendation using Groq's Llama3 model.
    Returns recommendation text, action, and action color based on AQI and weather conditions.
    """
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return _error_recommendation("Groq API key not configured")

        client = Groq(api_key=api_key)

        system_prompt = """You are a public health advisor for elementary schools in North Carolina. You specialize in asthma and air quality. Your job is to give school administrators one clear, actionable recommendation about outdoor activities. Be direct, specific, and compassionate. Always mention the specific risk to children with asthma. Keep response to 3 sentences max. End with one of these exact phrases on its own line: PROCEED WITH OUTDOOR ACTIVITIES | USE CAUTION FOR SENSITIVE STUDENTS | CANCEL OUTDOOR ACTIVITIES TODAY"""

        user_message = f"""Current Air Quality Data:
- AQI: {aqi}
- Main Pollutant: {main_pollutant}
- Temperature: {temperature}°F
- Humidity: {humidity}%
- Wind Speed: {wind_speed} mph
- Forecast Trend: {forecast_trend}

Provide your recommendation for outdoor school activities."""

        message = client.messages.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "user", "content": user_message}
            ],
            system=system_prompt,
            max_tokens=500,
            temperature=0.3
        )

        response_text = message.content[0].text if message.content else ""

        recommendation_text, action = _parse_recommendation_response(response_text)
        action_color = _get_action_color(action)

        return {
            "recommendation_text": recommendation_text,
            "action": action,
            "action_color": action_color,
            "error": None
        }

    except Exception as e:
        return _error_recommendation(f"Failed to generate recommendation: {str(e)}")


def _parse_recommendation_response(response: str) -> tuple:
    """
    Parse the Groq response to extract recommendation text and action.
    Looks for the action phrase at the end of the response.
    """
    lines = response.strip().split("\n")

    action_phrases = [
        "PROCEED WITH OUTDOOR ACTIVITIES",
        "USE CAUTION FOR SENSITIVE STUDENTS",
        "CANCEL OUTDOOR ACTIVITIES TODAY"
    ]

    action = None
    recommendation_lines = []

    for line in lines:
        line_stripped = line.strip()
        if any(phrase in line_stripped for phrase in action_phrases):
            action = line_stripped
        else:
            if line_stripped:
                recommendation_lines.append(line_stripped)

    if action is None:
        action = action_phrases[0]

    recommendation_text = " ".join(recommendation_lines).strip()
    if not recommendation_text:
        recommendation_text = f"Based on current air quality conditions, {action.lower()}."

    return recommendation_text, action


def _get_action_color(action: str) -> str:
    """Map action phrase to color code."""
    if "PROCEED" in action:
        return "green"
    elif "CAUTION" in action:
        return "yellow"
    else:
        return "red"


def _error_recommendation(error_msg: str) -> dict:
    """Return a standardized error response for recommendation."""
    return {
        "recommendation_text": "Unable to generate recommendation at this time. Please check the dashboard or contact support.",
        "action": "USE CAUTION FOR SENSITIVE STUDENTS",
        "action_color": "yellow",
        "error": error_msg
    }
