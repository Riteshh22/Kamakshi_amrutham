# Kamakshi Amrutham FastAPI Backend 🍱

Python FastAPI backend for Kamakshi Amrutham vegetarian lunch subscription service in Hyderabad.

## Features
- **Supabase Auth Integration**: Validates Supabase JWT Bearer Tokens on incoming API requests.
- **Strict Role-Based Authorization**: Requires `"Profiles".role == "admin"` for all `/api/admin/*` routes.
- **Authoritative Business Logic**: Calculates subscription duration (Daily = 1 day, Monthly = 30 days, 3 Months = 90 days), handles meal pause ranges, and generates daily orders safely.
- **Resource Ownership Enforcement**: Enforces that customers can only query/update their own daily orders, subscriptions, feedback, and complaints.

## Running Locally
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive OpenAPI documentation: `http://localhost:8000/docs`
Health check endpoint: `GET http://localhost:8000/health`
