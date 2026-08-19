from fastapi import APIRouter, Depends
from typing import List
from app.schemas.profile import ProfileResponse
from app.dependencies.admin import require_admin
from app.supabase_client import supabase

router = APIRouter(prefix="/api/admin/customers", tags=["Admin Customers"])

@router.get("", response_model=List[ProfileResponse])
async def get_admin_customers(admin: dict = Depends(require_admin)):
    res = supabase.from_("Profiles").select("*").eq("role", "customer").execute()
    return res.data or []
