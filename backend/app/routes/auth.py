import logging
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse
from app.dependencies.auth import get_current_user
from app.supabase_client import supabase

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse)
async def register(body: RegisterRequest):
    try:
        # Supabase Auth signUp()
        auth_res = supabase.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {
                    "full_name": body.full_name,
                    "role": "customer"  # Customer role strictly enforced server-side
                }
            }
        })
        user = auth_res.user
        if not user:
            raise HTTPException(status_code=400, detail="Registration failed.")

        # Create record in "Profiles" table (Capital P, as per schema)
        profile_data = {
            "id": user.id,
            "full_name": body.full_name,
            "email": body.email,
            "phone": body.phone,
            "delivery_address": body.delivery_address,
            "area": body.area,
            "pincode": body.pincode,
            "role": "customer"
        }
        supabase.from_("Profiles").insert(profile_data).execute()
        logger.info(f"[POST /api/auth/register] Registered user_id={user.id} email={body.email}")

        session = auth_res.session
        return AuthResponse(
            user_id=user.id,
            email=user.email,
            role="customer",
            access_token=session.access_token if session else None
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[POST /api/auth/register] Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    try:
        auth_res = supabase.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password
        })
        user = auth_res.user
        session = auth_res.session
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials.")

        # Fetch role authoritatively from "Profiles" table — never trust frontend
        profile_res = supabase.from_("Profiles").select("role").eq("id", user.id).single().execute()
        role = profile_res.data.get("role", "customer") if profile_res.data else "customer"
        logger.info(f"[POST /api/auth/login] Login OK — user_id={user.id} role={role}")

        return AuthResponse(
            user_id=user.id,
            email=user.email,
            role=role,
            access_token=session.access_token if session else None
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[POST /api/auth/login] Error: {e}")
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Returns the authenticated user's full profile from public."Profiles".
    Includes role field so the frontend can determine admin vs. customer.
    """
    user_id = current_user.get("id")
    logger.info(f"[GET /api/auth/me] Fetching profile for user_id={user_id}")

    try:
        profile_res = supabase.from_("Profiles").select("*").eq("id", user_id).single().execute()
        logger.info(f"[GET /api/auth/me] Profile result: {profile_res.data}")
    except Exception as e:
        logger.error(f"[GET /api/auth/me] Supabase error for user_id={user_id}: {e}")
        raise HTTPException(status_code=500, detail="Database error fetching profile.")

    if not profile_res.data:
        logger.warning(f"[GET /api/auth/me] No profile found for user_id={user_id}")
        raise HTTPException(
            status_code=404,
            detail=f"Profile not found for user ID: {user_id}",
        )

    return profile_res.data
