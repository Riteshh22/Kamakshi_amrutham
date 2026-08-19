import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

# Configure logging so diagnostic messages appear in uvicorn terminal output
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

# Import Customer Routers
from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router
from app.routes.plans import router as plans_router
from app.routes.subscriptions import router as subscriptions_router
from app.routes.orders import router as orders_router
from app.routes.feedback import router as feedback_router
from app.routes.complaints import router as complaints_router
from app.routes.notifications import router as notifications_router

# Import Admin Routers
from app.routes.admin.auth import router as admin_auth_router
from app.routes.admin.dashboard import router as admin_dashboard_router
from app.routes.admin.orders import router as admin_orders_router
from app.routes.admin.customers import router as admin_customers_router
from app.routes.admin.subscriptions import router as admin_subscriptions_router
from app.routes.admin.payments import router as admin_payments_router
from app.routes.admin.deliveries import router as admin_deliveries_router
from app.routes.admin.feedback import router as admin_feedback_router
from app.routes.admin.complaints import router as admin_complaints_router

app = FastAPI(
    title="Kamakshi Amrutham API",
    description="Subscription-based vegetarian mid-day meal delivery service in Hyderabad, India.",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["*"],
    max_age=600,
)

# Register Customer Routers
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(plans_router)
app.include_router(subscriptions_router)
app.include_router(orders_router)
app.include_router(feedback_router)
app.include_router(complaints_router)
app.include_router(notifications_router)

# Register Admin Routers
app.include_router(admin_auth_router)
app.include_router(admin_dashboard_router)
app.include_router(admin_orders_router)
app.include_router(admin_customers_router)
app.include_router(admin_subscriptions_router)
app.include_router(admin_payments_router)
app.include_router(admin_deliveries_router)
app.include_router(admin_feedback_router)
app.include_router(admin_complaints_router)

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Service health check endpoint.
    """
    return {"status": "ok"}
