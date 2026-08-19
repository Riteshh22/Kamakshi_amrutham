from app.supabase_client import supabase

class AuthService:
    @staticmethod
    def get_profile(user_id: str) -> dict:
        res = supabase.from_("Profiles").select("*").eq("id", user_id).single().execute()
        return res.data or {}

    @staticmethod
    def update_profile(user_id: str, updates: dict) -> dict:
        filtered = {k: v for k, v in updates.items() if v is not None}
        res = supabase.from_("Profiles").update(filtered).eq("id", user_id).execute()
        return res.data[0] if res.data else {}

auth_service = AuthService()
