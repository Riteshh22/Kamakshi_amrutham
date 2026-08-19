from pydantic import BaseModel
from typing import Optional

class CreateComplaintRequest(BaseModel):
    order_id: str
    description: str

class UpdateComplaintRequest(BaseModel):
    status: str # pending | in_progress | resolved | rejected
    admin_response: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: str
    user_id: str
    order_id: str
    description: str
    status: str
    admin_response: Optional[str] = None
    created_at: Optional[str] = None
    customer_name: Optional[str] = None
    order_date: Optional[str] = None
