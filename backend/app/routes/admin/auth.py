import logging
import requests as http_requests
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.config import settings
from app.supabase_client import supabase
from app.utils.security import create_admin_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/auth", tags=["Admin Auth"])


class AdminEmailVerifyRequest(BaseModel):
    email: EmailStr


class AdminAuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str


@router.post("/verify-email", response_model=AdminAuthResponse)
async def admin_verify_email(body: AdminEmailVerifyRequest):
    """
    Admin login via email only.

    Flow:
      1. Receive email address from the admin login form.
      2. Use Supabase Admin REST API (service_role) to find the Auth user by email.
      3. Get the Auth user's UUID.
      4. Query public."Profiles" using that UUID.
      5. If Profiles.role == "admin" → issue a signed backend JWT.
      6. Otherwise → 403 Access Denied.

    No password is used. No hardcoded emails or UUIDs.
    """
    email = body.email.lower().strip()
    logger.info(f"[POST /api/admin/auth/verify-email] Admin login attempt for email={email}")

    # ── Step 1: Look up the Auth user by email via Supabase Admin REST API ──
    auth_user = _find_auth_user_by_email(email)
    if not auth_user:
        logger.warning(f"[admin/verify-email] No auth.users entry found for email={email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You do not have administrator permissions.",
        )

    user_id = auth_user.get("id")
    logger.info(f"[admin/verify-email] Found auth user: user_id={user_id} email={email}")

    # ── Step 2: Query public."Profiles" by UUID ──
    profile_data = None
    try:
        profile_res = supabase.from_("Profiles").select("role").eq("id", user_id).single().execute()
        profile_data = profile_res.data if profile_res else None
        logger.info(f"[admin/verify-email] Profiles query result: {profile_data}")
    except Exception as e:
        logger.warning(f"[admin/verify-email] Supabase Profiles query error: {e}")
        profile_data = None

    if not profile_data:
        logger.warning(f"[admin/verify-email] No Profiles row found for user_id={user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You do not have administrator permissions.",
        )

    role = profile_data.get("role")
    logger.info(f"[admin/verify-email] user_id={user_id} role='{role}'")

    # ── Step 3: Check role ──
    if role != "admin":
        logger.warning(f"[admin/verify-email] DENIED — user_id={user_id} role='{role}' is not admin.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You do not have administrator permissions.",
        )

    # ── Step 4: Issue a signed backend JWT ──
    token = create_admin_token(user_id=user_id, email=email)
    logger.info(f"[admin/verify-email] Admin session token issued for user_id={user_id}")

    return AdminAuthResponse(
        access_token=token,
        user_id=user_id,
        email=email,
    )


def _find_auth_user_by_email(email: str) -> dict | None:
    """
    Calls the Supabase Admin REST API to look up an auth.users entry by email.
    Requires SUPABASE_SERVICE_ROLE_KEY to be set (backend-only, never exposed to frontend).
    """
    url = f"{settings.SUPABASE_URL}/auth/v1/admin/users"
    headers = {
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }
    params = {"filter": email}  # Supabase supports email filter on admin users list

    try:
        resp = http_requests.get(url, headers=headers, params=params, timeout=10)
        if resp.status_code != 200:
            logger.error(f"[_find_auth_user_by_email] Admin API returned {resp.status_code}: {resp.text}")
            return None

        data = resp.json()
        users = data.get("users", [])

        # Exact email match (filter may return partial matches)
        for user in users:
            if user.get("email", "").lower() == email:
                return user

        return None
    except Exception as e:
        logger.error(f"[_find_auth_user_by_email] HTTP request failed: {e}")
        return None
