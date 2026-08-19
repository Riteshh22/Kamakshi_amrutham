from pydantic import BaseModel
from typing import Optional

class PaymentResponse(BaseModel):
    id: str
    user_id: str
    subscription_id: str
    amount: float
    payment_method: str
    transaction_id: str
    status: str # paid | pending | failed | refunded
    paid_at: Optional[str] = None
    created_at: Optional[str] = None
    customer_name: Optional[str] = None
    plan_name: Optional[str] = None
