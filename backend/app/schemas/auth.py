from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    delivery_address: str
    area: str
    pincode: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user_id: str
    email: str
    role: str = "customer"
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
