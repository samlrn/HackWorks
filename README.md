# AirAware: Real-Time Air Quality Alerts for NC Schools

Protecting children with asthma, one breath at a time.

## Overview

AirAware is a complete production-ready web application that helps parents and school administrators in North Carolina make real-time decisions about outdoor activities. It pulls live EPA air quality data, combines it with weather forecasts, generates AI-powered recommendations, and sends SMS alerts to subscribed parents.

**The Problem:**
- 1 in 11 NC children have asthma
- Top 15 state for asthma-related hospitalizations
- Average cost: $3,200 per child annually
- Zero schools with real-time air quality monitoring

**The Solution:**
- Real-time EPA air quality data
- AI-powered plain-English recommendations
- Instant SMS alerts to parents and educators
- Beautiful, intuitive web dashboard

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)
- Axios (API calls)

### Backend
- Python 3.11+
- FastAPI
- Uvicorn
- Supabase (PostgreSQL)
- Twilio (SMS)
- Groq AI (Llama3)

### External APIs
- EPA AirNow API (air quality)
- OpenWeatherMap API (weather forecasts)
- Groq API (AI recommendations)
- Twilio API (SMS distribution)
- Supabase API (database)

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- npm or yarn package manager
- A Supabase account (free tier available)
- API keys for EPA AirNow, OpenWeatherMap, Groq, and Twilio

## Installation

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` with your API keys from:
- https://www.airnowapi.org/ (EPA AirNow)
- https://openweathermap.org/api (Weather)
- https://console.groq.com (Groq AI)
- https://www.twilio.com (SMS)
- https://supabase.com (Database)

### 2. Database Setup

In Supabase SQL Editor, paste and run `backend/database_migration.sql`

### 3. Start Backend

```bash
python main.py
```

Server: http://localhost:8000

### 4. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:5173

## Project Structure

```
backend/
├── main.py
├── requirements.txt
├── services/ (airnow, weather, groq_ai, sms, database)
├── models/ (schemas)
└── routers/ (air_quality, alerts, subscribers)

frontend/
├── package.json
├── src/
│   ├── App.jsx
│   ├── api/ (airquality.js)
│   ├── components/ (Header, SearchBar, AQIDisplay, etc.)
│   └── pages/ (HomePage, DashboardPage, AboutPage)
```

## API Endpoints

- `GET /api/air-quality/{zip_code}` - Air quality + AI recommendation
- `POST /api/subscribers/signup` - Subscribe to alerts
- `GET /api/subscribers/count/{zip_code}` - Subscriber count
- `POST /api/alerts/trigger` - Send alerts for a zip
- `POST /api/alerts/trigger-all` - Send all pending alerts
- `GET /` - Health check

## Key Features

✅ Real-time EPA air quality data
✅ AI-powered recommendations (Groq Llama3)
✅ SMS alerts via Twilio
✅ Beautiful responsive UI
✅ Demo mode for testing
✅ Comprehensive error handling

## Demo Mode

1. Click "Demo Mode" in header
2. Shows simulated AQI of 145
3. Test SMS alerts without real API calls
4. Default zip: 27606 (Raleigh, NC)

## Testing

```bash
# Test health
curl http://localhost:8000

# Test subscriber signup
curl -X POST http://localhost:8000/api/subscribers/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone_number":"5551234567","zip_code":"27606","role":"Parent"}'

# Test alert trigger
curl -X POST http://localhost:8000/api/alerts/trigger \
  -H "Content-Type: application/json" \
  -d '{"zip_code":"27606","override_aqi":150}'
```

## Troubleshooting

**Backend won't start:**
- Check Python 3.11+
- Verify all API keys in `.env`
- Run `pip install -r requirements.txt`

**Frontend won't connect:**
- Ensure backend is running on :8000
- Check `VITE_API_BASE_URL` in `.env`
- Browser console for network errors

**No air quality data:**
- Try zip codes: 27606, 27601, 28201
- Check EPA AirNow API status
- Use Demo Mode to test UI

## Future Roadmap

1. IoT sensor network at NC schools
2. Integration with school nurse systems
3. District-wide administrator dashboards
4. IBM watsonx AI for predictive modeling
5. Expansion to all 50 states

## License

MIT License - Open source for public health

## Support

- Email: info@airaware.nc
- GitHub Issues and Discussions

---

**Made with ❤️ for NC children with asthma**

*Production-ready application • Last Updated: March 3, 2026*