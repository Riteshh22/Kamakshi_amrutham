from app.supabase_client import supabase

class NotificationService:
    @staticmethod
    def get_user_notifications(user_id: str) -> list:
        res = (
            supabase.from_("notifications")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return res.data or []

    @staticmethod
    def mark_read(user_id: str, notification_id: str) -> dict:
        res = (
            supabase.from_("notifications")
            .update({"is_read": True})
            .eq("id", notification_id)
            .eq("user_id", user_id)
            .execute()
        )
        return res.data[0] if res.data else {"id": notification_id, "is_read": True}

    @staticmethod
    def mark_all_read(user_id: str) -> bool:
        supabase.from_("notifications").update({"is_read": True}).eq("user_id", user_id).execute()
        return True

notification_service = NotificationService()
