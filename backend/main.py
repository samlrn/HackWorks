import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from routers import air_quality, alerts, subscribers
from models.schemas import HealthCheckResponse

load_dotenv()

app = FastAPI(
    title="AirAware API",
    description="Real-time air quality alerts for NC schools",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "http://localhost:5173")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(air_quality.router)
app.include_router(alerts.router)
app.include_router(subscribers.router)


@app.get("/", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint."""
    return {"status": "AirAware API running"}


@app.get("/health", response_model=HealthCheckResponse)
async def health():
    """Alternative health check endpoint."""
    return {"status": "AirAware API running"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
