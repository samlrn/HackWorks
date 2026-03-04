from fastapi import APIRouter, HTTPException

from models.schemas import AlertTriggerRequest, AlertResponse
from services import airnow, database, sms
from datetime import datetime

router = APIRouter()


@router.post("/api/alerts/trigger", response_model=AlertResponse)
async def trigger_alert(request: AlertTriggerRequest):
    """
    Trigger alerts for a specific zip code.
    Sends SMS to all active subscribers if AQI > 100 or override_aqi provided.
    """
    try:
        zip_code = request.zip_code

        if request.override_aqi is not None:
            aqi = request.override_aqi
            is_demo_mode = True
        else:
            aqi_data = await airnow.get_aqi_data(zip_code)
            if aqi_data.get("error"):
                return AlertResponse(
                    success=False,
                    message="Air quality data unavailable",
                    recipients_count=0,
                    error=aqi_data.get("error")
                )
            aqi = aqi_data["aqi"]
            is_demo_mode = False

        if aqi <= 100 and not is_demo_mode:
            return AlertResponse(
                success=True,
                message="Air quality currently safe, no alerts sent",
                recipients_count=0
            )

        subscribers = await database.get_subscribers_by_zip(zip_code)

        if not subscribers:
            return AlertResponse(
                success=True,
                message=f"No active subscribers for zip {zip_code}",
                recipients_count=0
            )

        action = "CANCEL OUTDOOR ACTIVITIES TODAY" if aqi > 150 else "USE CAUTION FOR SENSITIVE STUDENTS"

        sms_result = sms.send_bulk_alerts(
            zip_code=zip_code,
            aqi=aqi,
            action=action,
            subscribers=subscribers
        )

        alert_message = f"AQI Alert: AQI {aqi} - {action}"

        log_result = await database.log_alert(
            zip_code=zip_code,
            aqi_value=aqi,
            alert_message=alert_message,
            recipients_count=sms_result["sent_count"]
        )

        return AlertResponse(
            success=True,
            message=f"Alerts sent to {sms_result['sent_count']} recipients for zip {zip_code}",
            recipients_count=sms_result["sent_count"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error triggering alerts: {str(e)}")


@router.post("/api/alerts/trigger-all", response_model=AlertResponse)
async def trigger_alerts_all():
    """
    Check all zip codes with active subscribers and trigger alerts for any with dangerous AQI.
    """
    try:
        zip_codes = await database.get_all_active_zip_codes()

        total_sent = 0
        alerted_zips = []

        for zip_code in zip_codes:
            aqi_data = await airnow.get_aqi_data(zip_code)

            if aqi_data.get("error") or aqi_data["aqi"] <= 100:
                continue

            subscribers = await database.get_subscribers_by_zip(zip_code)
            if not subscribers:
                continue

            action = "CANCEL OUTDOOR ACTIVITIES TODAY" if aqi_data["aqi"] > 150 else "USE CAUTION FOR SENSITIVE STUDENTS"

            sms_result = sms.send_bulk_alerts(
                zip_code=zip_code,
                aqi=aqi_data["aqi"],
                action=action,
                subscribers=subscribers
            )

            alert_message = f"AQI Alert: AQI {aqi_data['aqi']} - {action}"
            await database.log_alert(
                zip_code=zip_code,
                aqi_value=aqi_data["aqi"],
                alert_message=alert_message,
                recipients_count=sms_result["sent_count"]
            )

            total_sent += sms_result["sent_count"]
            alerted_zips.append(zip_code)

        return AlertResponse(
            success=True,
            message=f"Checked {len(zip_codes)} zip codes. Alerts sent for {len(alerted_zips)} locations: {', '.join(alerted_zips)}. Total recipients: {total_sent}",
            recipients_count=total_sent
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error triggering bulk alerts: {str(e)}")
