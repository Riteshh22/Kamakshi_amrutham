import logging
from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional, List
from app.schemas.order import DailyOrderResponse, UpdateOrderStatusRequest
from app.dependencies.admin import require_admin
from app.supabase_client import supabase
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/orders", tags=["Admin Orders"])


@router.get("/today", response_model=List[DailyOrderResponse])
async def get_admin_orders_today(
    area: Optional[str] = Query(None),
    payment_status: Optional[str] = Query(None),
    delivery_status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    admin: dict = Depends(require_admin),
):
    today_str = datetime.now().strftime("%Y-%m-%d")

    # Join daily_orders → Profiles and subscriptions → subscription_plans
    query = (
        supabase.from_("daily_orders")
        .select("*, profile:Profiles(full_name, phone), subscription:subscriptions(plan:subscription_plans(name))")
        .eq("date", today_str)
    )

    if area:
        query = query.eq("area", area)
    if delivery_status:
        query = query.eq("status", delivery_status)

    try:
        res = query.execute()
        data = res.data or []
    except Exception as e:
        logger.error(f"[GET /api/admin/orders/today] Supabase error: {e}")
        data = []

    result = []
    for item in data:
        profile = item.get("profile") or {}
        subscription = item.get("subscription") or {}
        plan = subscription.get("plan") or {}

        result.append(
            DailyOrderResponse(
                id=item.get("id"),
                user_id=item.get("user_id"),
                subscription_id=item.get("subscription_id"),
                date=item.get("date"),
                status=item.get("status"),
                received_status=item.get("received_status", False),
                delivery_address=item.get("delivery_address"),
                area=item.get("area"),
                created_at=item.get("created_at"),
                customer_name=profile.get("full_name"),
                phone=profile.get("phone"),
                subscription_plan_name=plan.get("name"),
                payment_status=None,  # payments linked separately; not hardcoded
            )
        )

    return result


@router.put("/{id}/status", response_model=DailyOrderResponse)
async def update_order_status(
    id: str,
    body: UpdateOrderStatusRequest,
    admin: dict = Depends(require_admin),
):
    try:
        res = supabase.from_("daily_orders").update({"status": body.status}).eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail=f"Order {id} not found.")
        updated = res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[PUT /api/admin/orders/{id}/status] Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update order status.")

    return DailyOrderResponse(
        id=updated.get("id"),
        user_id=updated.get("user_id"),
        subscription_id=updated.get("subscription_id"),
        date=updated.get("date"),
        status=updated.get("status"),
        received_status=updated.get("received_status", False),
        delivery_address=updated.get("delivery_address"),
        area=updated.get("area"),
        created_at=updated.get("created_at"),
    )
