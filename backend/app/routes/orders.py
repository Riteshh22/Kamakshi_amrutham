from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.schemas.order import DailyOrderResponse
from app.dependencies.auth import get_current_user
from app.services.order_service import order_service

router = APIRouter(prefix="/api/orders", tags=["Customer Orders"])

@router.get("/today", response_model=Optional[DailyOrderResponse])
async def get_today_order(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return order_service.get_today_order(user_id)

@router.get("", response_model=List[DailyOrderResponse])
async def get_orders(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return order_service.get_user_orders(user_id)

@router.get("/{id}", response_model=DailyOrderResponse)
async def get_order_by_id(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    order = order_service.get_order_by_id(user_id, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or access denied.")
    return order

@router.post("/{id}/confirm", response_model=DailyOrderResponse)
async def confirm_order_received(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return order_service.confirm_received(user_id, id)

@router.post("/{id}/skip", response_model=DailyOrderResponse)
async def skip_order(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return order_service.skip_order(user_id, id)
