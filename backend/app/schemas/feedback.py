from pydantic import BaseModel, Field
from typing import Optional

class CreateFeedbackRequest(BaseModel):
    order_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    user_id: str
    order_id: str
    rating: int
    comment: Optional[str] = None
    created_at: Optional[str] = None
    customer_name: Optional[str] = None
    order_date: Optional[str] = None
