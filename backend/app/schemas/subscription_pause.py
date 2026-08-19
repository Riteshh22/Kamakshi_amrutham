from pydantic import BaseModel
from typing import Optional

class CreateSubscriptionPauseRequest(BaseModel):
    subscription_id: str
    start_date: str
    end_date: str
    reason: Optional[str] = None

class SubscriptionPauseResponse(BaseModel):
    id: str
    user_id: str
    subscription_id: str
    start_date: str
    end_date: str
    reason: Optional[str] = None
    created_at: Optional[str] = None
