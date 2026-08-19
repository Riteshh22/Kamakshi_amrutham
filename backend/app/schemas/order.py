from pydantic import BaseModel
from typing import Optional

class UpdateOrderStatusRequest(BaseModel):
    status: str # pending | preparing | out_for_delivery | delivered | cancelled | skipped

class DailyOrderResponse(BaseModel):
    id: str
    user_id: str
    subscription_id: str
    date: str
    status: str
    received_status: bool
    delivery_address: str
    area: str
    created_at: Optional[str] = None
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    subscription_plan_name: Optional[str] = None
    payment_status: Optional[str] = None
