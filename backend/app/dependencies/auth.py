import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.supabase_client import supabase
from app.utils.security import decode_token

logger = logging.getLogger(__name__)
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Validates the Supabase Bearer token and returns the authenticated user identity.
    Never trusts user_id supplied by the frontend.
    Raises 401 if the token is invalid or cannot be verified.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token required.",
        )

    # --- Primary path: verify with Supabase Auth API ---
    try:
        res = supabase.auth.get_user(token)
        if res and res.user:
            user_id = res.user.id
            logger.info(f"[get_current_user] Supabase verified user_id={user_id} email={res.user.email}")
            return {
                "id": user_id,
                "email": res.user.email,
                "user_metadata": res.user.user_metadata or {},
            }
        else:
            logger.warning("[get_current_user] Supabase returned no user for the given token.")
    except Exception as e:
        logger.warning(f"[get_current_user] Supabase auth.get_user failed: {e}")

    # --- Fallback path: decode JWT locally (for local dev without real Supabase creds) ---
    try:
        payload = decode_token(token)
        if payload and "sub" in payload:
            user_id = payload["sub"]
            logger.info(f"[get_current_user] JWT decoded locally — user_id={user_id}")
            return {
                "id": user_id,
                "email": payload.get("email", ""),
                "user_metadata": payload.get("user_metadata", {}),
            }
    except Exception as e:
        logger.warning(f"[get_current_user] Local JWT decode failed: {e}")

    # --- No valid identity found — reject the request ---
    logger.error("[get_current_user] Could not verify token via Supabase or local decode. Returning 401.")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
    )
