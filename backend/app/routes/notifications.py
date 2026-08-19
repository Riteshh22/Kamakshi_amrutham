from fastapi import APIRouter, Depends
from typing import List
from app.dependencies.auth import get_current_user
from app.services.notification_service import notification_service

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return notification_service.get_user_notifications(user_id)

@router.put("/read-all")
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    notification_service.mark_all_read(user_id)
    return {"success": True}

@router.put("/{id}/read")
async def mark_read(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return notification_service.mark_read(user_id, id)
