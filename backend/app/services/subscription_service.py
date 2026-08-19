from datetime import datetime, timedelta
from app.supabase_client import supabase
from app.utils.helpers import calculate_end_date

class SubscriptionService:
    @staticmethod
    def get_plans() -> list:
        res = supabase.from_("subscription_plans").select("*").order("price").execute()
        return res.data or []

    @staticmethod
    def get_current_subscription(user_id: str) -> dict:
        res = (
            supabase.from_("subscriptions")
            .select("*, plan:subscription_plans(*)")
            .eq("user_id", user_id)
            .eq("status", "active")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        return res.data[0] if res.data else None

    @staticmethod
    def get_subscription_history(user_id: str) -> list:
        res = (
            supabase.from_("subscriptions")
            .select("*, plan:subscription_plans(*)")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return res.data or []

    @staticmethod
    def create_subscription(user_id: str, plan_id: str) -> dict:
        start_date = datetime.now()
        end_date = calculate_end_date(start_date, plan_id)

        new_sub = {
            "user_id": user_id,
            "plan_id": plan_id,
            "status": "active",
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
        }

        res = supabase.from_("subscriptions").insert(new_sub).execute()
        return res.data[0] if res.data else new_sub

    @staticmethod
    def cancel_subscription(user_id: str, sub_id: str) -> dict:
        res = (
            supabase.from_("subscriptions")
            .update({"status": "cancelled"})
            .eq("id", sub_id)
            .eq("user_id", user_id)
            .execute()
        )
        return res.data[0] if res.data else {}

    @staticmethod
    def pause_subscription(user_id: str, sub_id: str, start_date: str, end_date: str, reason: str = None) -> dict:
        pause_record = {
            "user_id": user_id,
            "subscription_id": sub_id,
            "start_date": start_date,
            "end_date": end_date,
            "reason": reason,
        }
        res = supabase.from_("subscription_pauses").insert(pause_record).execute()
        return res.data[0] if res.data else pause_record

    @staticmethod
    def get_subscription_pauses(user_id: str, sub_id: str) -> list:
        res = (
            supabase.from_("subscription_pauses")
            .select("*")
            .eq("subscription_id", sub_id)
            .eq("user_id", user_id)
            .execute()
        )
        return res.data or []

    @staticmethod
    def delete_pause(user_id: str, sub_id: str, pause_id: str) -> bool:
        res = (
            supabase.from_("subscription_pauses")
            .delete()
            .eq("id", pause_id)
            .eq("user_id", user_id)
            .eq("subscription_id", sub_id)
            .execute()
        )
        return True

subscription_service = SubscriptionService()
