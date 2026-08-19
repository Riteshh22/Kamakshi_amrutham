from pydantic import BaseModel, model_validator
from typing import Optional, Any

class ProfileBase(BaseModel):
    full_name: str
    phone: str
    delivery_address: Optional[str] = None
    full_address: Optional[str] = None
    area: str
    pincode: str

    @model_validator(mode="before")
    @classmethod
    def sync_address(cls, data: Any) -> Any:
        if isinstance(data, dict):
            addr = data.get("full_address") or data.get("delivery_address") or ""
            if not data.get("delivery_address"):
                data["delivery_address"] = addr
            if not data.get("full_address"):
                data["full_address"] = addr
        return data

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    delivery_address: Optional[str] = None
    full_address: Optional[str] = None
    area: Optional[str] = None
    pincode: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: str
    email: Optional[str] = ""
    role: str
    created_at: Optional[str] = None
