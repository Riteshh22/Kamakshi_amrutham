import logging
from fastapi import Depends, HTTPException, status
from app.dependencies.auth import get_current_user
from app.supabase_client import supabase

logger = logging.getLogger(__name__)

async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Verifies that the authenticated user has role == 'admin' in the public."Profiles" table.
    Flow: Bearer JWT → get_current_user() → user UUID → "Profiles".id → role check.
    Never trusts role from frontend, email prefix, or hardcoded UUIDs.
    """
    user_id = current_user.get("id")
    if not user_id:
        logger.error("[require_admin] No user_id in current_user dict — rejecting.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User authentication failed.",
        )

    logger.info(f"[require_admin] Checking admin role for user_id={user_id}")

    try:
        res = supabase.from_("Profiles").select("role").eq("id", user_id).single().execute()
        logger.info(f"[require_admin] Profiles query result: {res.data}")

        if not res.data:
            logger.warning(f"[require_admin] No Profiles row found for user_id={user_id}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: No profile found for this user.",
            )

        role = res.data.get("role")
        logger.info(f"[require_admin] user_id={user_id} has role='{role}'")

        if role == "admin":
            logger.info(f"[require_admin] Access GRANTED for user_id={user_id}")
            return current_user

        logger.warning(f"[require_admin] Access DENIED — user_id={user_id} role='{role}' is not admin.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Admin access required. Your role is '{role}'.",
        )

    except HTTPException:
        # Re-raise FastAPI HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"[require_admin] Unexpected error querying Profiles for user_id={user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal error verifying admin privileges.",
        )
