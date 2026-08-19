import logging
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.profile import ProfileUpdate, ProfileResponse
from app.dependencies.auth import get_current_user
from app.supabase_client import supabase

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """
    Returns the authenticated user's profile from public."Profiles".
    Requires a valid Supabase Bearer token.
    Returns 404 if the profile row genuinely does not exist.
    """
    user_id = current_user.get("id")
    logger.info(f"[GET /api/profile] Querying Profiles for user_id={user_id}")

    try:
        res = supabase.from_("Profiles").select("*").eq("id", user_id).single().execute()
        logger.info(f"[GET /api/profile] Profiles query result: {res.data}")
    except Exception as e:
        logger.error(f"[GET /api/profile] Supabase query error for user_id={user_id}: {e}")
        raise HTTPException(status_code=500, detail="Database error fetching profile.")

    if not res.data:
        logger.warning(f"[GET /api/profile] No profile found for user_id={user_id} — returning 404.")
        raise HTTPException(
            status_code=404,
            detail=f"Profile not found for user ID: {user_id}",
        )

    return res.data


@router.put("", response_model=ProfileResponse)
async def update_profile(body: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    """
    Updates the authenticated user's profile in public."Profiles".
    """
    user_id = current_user.get("id")
    logger.info(f"[PUT /api/profile] Updating Profiles for user_id={user_id}")

    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}

    try:
        res = supabase.from_("Profiles").update(updates).eq("id", user_id).execute()
        logger.info(f"[PUT /api/profile] Update result: {res.data}")
    except Exception as e:
        logger.error(f"[PUT /api/profile] Supabase update error for user_id={user_id}: {e}")
        raise HTTPException(status_code=500, detail="Database error updating profile.")

    if not res.data:
        raise HTTPException(
            status_code=404,
            detail=f"Profile not found for user ID: {user_id}",
        )

    return res.data[0]
