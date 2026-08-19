from pydantic import BaseModel
from typing import Optional, List

class SubscriptionPlanResponse(BaseModel):
    id: str
    name: str
    price: float
    duration_days: int
    description: str
    features: List[str]

class CreateSubscriptionRequest(BaseModel):
    plan_id: str

class SubscriptionResponse(BaseModel):
    id: str
    user_id: str
    plan_id: str
    status: str # active | expired | cancelled | paused
    start_date: str
    end_date: str
    created_at: Optional[str] = None
    plan: Optional[SubscriptionPlanResponse] = None
