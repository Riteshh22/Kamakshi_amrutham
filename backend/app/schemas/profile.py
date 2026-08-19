from pydantic import BaseModel
from typing import Optional

class ProfileBase(BaseModel):
    full_name: str
    phone: str
    delivery_address: str
    area: str
    pincode: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    delivery_address: Optional[str] = None
    area: Optional[str] = None
    pincode: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: str
    email: str
    role: str
    created_at: Optional[str] = None
