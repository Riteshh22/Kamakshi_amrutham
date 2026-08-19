from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.schemas.feedback import FeedbackResponse
from app.dependencies.admin import require_admin
from app.supabase_client import supabase

router = APIRouter(prefix="/api/admin/feedback", tags=["Admin Feedback"])

@router.get("", response_model=List[FeedbackResponse])
async def get_admin_feedback(
    rating: Optional[int] = Query(None),
    admin: dict = Depends(require_admin),
):
    query = supabase.from_("feedback").select("*, profile:Profiles(full_name)")
    if rating:
        query = query.eq("rating", rating)
    res = query.order("created_at", desc=True).execute()
    data = res.data or []

    result = []
    for f in data:
        profile = f.get("profile") or {}
        result.append(
            FeedbackResponse(
                id=f.get("id"),
                user_id=f.get("user_id"),
                order_id=f.get("order_id"),
                rating=f.get("rating"),
                comment=f.get("comment"),
                created_at=f.get("created_at"),
                customer_name=profile.get("full_name", "Subscriber"),
            )
        )

    return result
