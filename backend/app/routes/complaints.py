from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.complaint import CreateComplaintRequest, ComplaintResponse
from app.dependencies.auth import get_current_user
from app.services.complaint_service import complaint_service

router = APIRouter(prefix="/api/complaints", tags=["Customer Complaints"])

@router.post("", response_model=ComplaintResponse)
async def submit_complaint(body: CreateComplaintRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return complaint_service.create_complaint(user_id, body.order_id, body.description)

@router.get("/my", response_model=List[ComplaintResponse])
async def get_my_complaints(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return complaint_service.get_user_complaints(user_id)

@router.get("/{id}", response_model=ComplaintResponse)
async def get_complaint_by_id(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    comp = complaint_service.get_complaint_by_id(user_id, id)
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found or access denied.")
    return comp
