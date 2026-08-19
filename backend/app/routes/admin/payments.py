from fastapi import APIRouter, Depends
from typing import List
from app.schemas.payment import PaymentResponse
from app.dependencies.admin import require_admin
from app.supabase_client import supabase

router = APIRouter(prefix="/api/admin/payments", tags=["Admin Payments"])

@router.get("", response_model=List[PaymentResponse])
async def get_admin_payments(admin: dict = Depends(require_admin)):
    res = supabase.from_("payments").select("*").order("created_at", desc=True).execute()
    return res.data or []
