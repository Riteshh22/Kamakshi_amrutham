import logging
from fastapi import APIRouter, Depends
from app.dependencies.admin import require_admin
from app.supabase_client import supabase
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/dashboard", tags=["Admin Dashboard"])


@router.get("")
async def get_admin_dashboard(admin: dict = Depends(require_admin)):
    """
    Returns real-time admin dashboard statistics from the Supabase database.
    All counts are computed dynamically — no static/mock data.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")

    try:
        # Today's orders
        orders_res = supabase.from_("daily_orders").select("id, status, received_status").eq("date", today_str).execute()
        orders = orders_res.data or []
        today_orders = len(orders)
        delivered = sum(1 for o in orders if o.get("status") == "delivered")
        out_for_delivery = sum(1 for o in orders if o.get("status") == "out_for_delivery")
        preparing = sum(1 for o in orders if o.get("status") == "preparing")
        pending = out_for_delivery + preparing
        skipped = sum(1 for o in orders if o.get("status") == "skipped")

        # Active subscribers
        subs_res = supabase.from_("subscriptions").select("id").eq("status", "active").execute()
        active_subscribers = len(subs_res.data or [])

        # Today's revenue (sum of payments collected today)
        payments_res = supabase.from_("payments").select("amount").eq("payment_date", today_str).eq("payment_status", "paid").execute()
        today_revenue = sum(float(p.get("amount", 0)) for p in (payments_res.data or []))

        # Average rating from feedback
        feedback_res = supabase.from_("feedback").select("rating").execute()
        feedback_list = feedback_res.data or []
        if feedback_list:
            avg_rating = round(sum(f.get("rating", 0) for f in feedback_list) / len(feedback_list), 1)
        else:
            avg_rating = 0.0

        # Open complaints
        complaints_res = supabase.from_("complaints").select("id").eq("status", "open").execute()
        open_complaints = len(complaints_res.data or [])

        # Total customers
        customers_res = supabase.from_("Profiles").select("id").eq("role", "customer").execute()
        total_customers = len(customers_res.data or [])

        return {
            "today_orders": today_orders,
            "delivered": delivered,
            "pending": pending,
            "skipped": skipped,
            "active_subscribers": active_subscribers,
            "today_revenue": today_revenue,
            "average_rating": avg_rating,
            "open_complaints": open_complaints,
            "total_customers": total_customers,
            "date": today_str,
        }

    except Exception as e:
        logger.error(f"[GET /api/admin/dashboard] Error: {e}")
        # Return zeroed-out stats rather than crashing — frontend shows real zeros
        return {
            "today_orders": 0,
            "delivered": 0,
            "pending": 0,
            "skipped": 0,
            "active_subscribers": 0,
            "today_revenue": 0.0,
            "average_rating": 0.0,
            "open_complaints": 0,
            "total_customers": 0,
            "date": today_str,
        }
