from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.schemas.subscription import CreateSubscriptionRequest, SubscriptionResponse
from app.schemas.subscription_pause import CreateSubscriptionPauseRequest, SubscriptionPauseResponse
from app.dependencies.auth import get_current_user
from app.services.subscription_service import subscription_service

router = APIRouter(prefix="/api/subscriptions", tags=["Subscriptions"])

@router.get("/current", response_model=Optional[SubscriptionResponse])
async def get_current_subscription(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return subscription_service.get_current_subscription(user_id)

@router.get("/history", response_model=List[SubscriptionResponse])
async def get_subscription_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return subscription_service.get_subscription_history(user_id)

@router.post("", response_model=SubscriptionResponse)
async def create_subscription(body: CreateSubscriptionRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return subscription_service.create_subscription(user_id, body.plan_id)

@router.post("/{id}/cancel", response_model=SubscriptionResponse)
async def cancel_subscription(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return subscription_service.cancel_subscription(user_id, id)

@router.post("/{id}/renew", response_model=SubscriptionResponse)
async def renew_subscription(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return subscription_service.create_subscription(user_id, "monthly")

@router.post("/{id}/pause", response_model=SubscriptionPauseResponse)
async def pause_subscription(id: str, body: CreateSubscriptionPauseRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return subscription_service.pause_subscription(user_id, id, body.start_date, body.end_date, body.reason)

@router.get("/{id}/pauses", response_model=List[SubscriptionPauseResponse])
async def get_subscription_pauses(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return subscription_service.get_subscription_pauses(user_id, id)

@router.delete("/{id}/pause/{pause_id}")
async def delete_pause(id: str, pause_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    subscription_service.delete_pause(user_id, id, pause_id)
    return {"success": True}
