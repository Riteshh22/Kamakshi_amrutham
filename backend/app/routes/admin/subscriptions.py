from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.schemas.subscription import SubscriptionResponse
from app.dependencies.admin import require_admin
from app.supabase_client import supabase

router = APIRouter(prefix="/api/admin/subscriptions", tags=["Admin Subscriptions"])

@router.get("", response_model=List[SubscriptionResponse])
async def get_admin_subscriptions(
    status: Optional[str] = Query(None),
    admin: dict = Depends(require_admin),
):
    query = supabase.from_("subscriptions").select("*, plan:subscription_plans(*)")
    if status:
        query = query.eq("status", status)
    res = query.execute()
    return res.data or []
