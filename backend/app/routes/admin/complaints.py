from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.complaint import ComplaintResponse, UpdateComplaintRequest
from app.dependencies.admin import require_admin
from app.supabase_client import supabase

router = APIRouter(prefix="/api/admin/complaints", tags=["Admin Complaints"])

@router.get("", response_model=List[ComplaintResponse])
async def get_admin_complaints(admin: dict = Depends(require_admin)):
    res = (
        supabase.from_("complaints")
        .select("*, profile:Profiles(full_name)")
        .order("created_at", desc=True)
        .execute()
    )
    data = res.data or []

    result = []
    for c in data:
        profile = c.get("profile") or {}
        result.append(
            ComplaintResponse(
                id=c.get("id"),
                user_id=c.get("user_id"),
                order_id=c.get("order_id"),
                description=c.get("description"),
                status=c.get("status"),
                admin_response=c.get("admin_response"),
                created_at=c.get("created_at"),
                customer_name=profile.get("full_name", "Subscriber"),
            )
        )

    return result

@router.put("/{id}", response_model=ComplaintResponse)
async def update_admin_complaint(
    id: str,
    body: UpdateComplaintRequest,
    admin: dict = Depends(require_admin),
):
    updates = {"status": body.status}
    if body.admin_response is not None:
        updates["admin_response"] = body.admin_response

    res = supabase.from_("complaints").update(updates).eq("id", id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail=f"Complaint {id} not found.")

    updated = res.data[0]
    return ComplaintResponse(
        id=updated.get("id"),
        user_id=updated.get("user_id"),
        order_id=updated.get("order_id"),
        description=updated.get("description"),
        status=updated.get("status"),
        admin_response=updated.get("admin_response"),
        created_at=updated.get("created_at"),
    )

