import jwt
import datetime
from typing import Optional
from app.config import settings


def decode_token(token: str) -> Optional[dict]:
    """
    Attempts to decode a JWT token.
    First tries with the backend ADMIN_JWT_SECRET (for admin session tokens).
    Falls back to unverified decode (for Supabase JWTs verified separately via get_user()).
    """
    # Try verifying as a backend-signed admin token
    try:
        payload = jwt.decode(
            token,
            settings.ADMIN_JWT_SECRET,
            algorithms=["HS256"],
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Expired admin token — reject
    except jwt.InvalidTokenError:
        pass  # Not a backend-signed token — try Supabase path

    # Fall back: decode without verification (Supabase JWTs are verified via auth.get_user())
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception:
        return None


def create_admin_token(user_id: str, email: str) -> str:
    """
    Creates a backend-signed JWT for an admin session.
    This token is issued after the backend confirms role == 'admin' in Profiles.
    Expires in 8 hours.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": "admin",
        "iat": now,
        "exp": now + datetime.timedelta(hours=8),
        "iss": "kamakshi-amrutham-backend",
    }
    return jwt.encode(payload, settings.ADMIN_JWT_SECRET, algorithm="HS256")
