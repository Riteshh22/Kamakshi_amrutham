from fastapi import APIRouter
from typing import List
from app.schemas.subscription import SubscriptionPlanResponse
from app.services.subscription_service import subscription_service

router = APIRouter(prefix="/api/plans", tags=["Subscription Plans"])

@router.get("", response_model=List[SubscriptionPlanResponse])
async def get_plans():
    return subscription_service.get_plans()
