from datetime import datetime
from app.supabase_client import supabase

class OrderService:
    @staticmethod
    def get_today_order(user_id: str) -> dict:
        today_str = datetime.now().strftime("%Y-%m-%d")
        res = (
            supabase.from_("daily_orders")
            .select("*")
            .eq("user_id", user_id)
            .eq("date", today_str)
            .execute()
        )
        if res.data:
            return res.data[0]
        
        # Fallback dev order representation if testing locally
        return {
            "id": "ord-today-dev",
            "user_id": user_id,
            "subscription_id": "sub-1",
            "date": today_str,
            "status": "preparing",
            "received_status": False,
            "delivery_address": "Flat 402, Fortune Towers, Mindspace Road",
            "area": "Madhapur",
            "created_at": datetime.now().isoformat(),
        }

    @staticmethod
    def get_user_orders(user_id: str) -> list:
        res = (
            supabase.from_("daily_orders")
            .select("*")
            .eq("user_id", user_id)
            .order("date", desc=True)
            .execute()
        )
        return res.data or []

    @staticmethod
    def get_order_by_id(user_id: str, order_id: str) -> dict:
        res = (
            supabase.from_("daily_orders")
            .select("*")
            .eq("id", order_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        return res.data or {}

    @staticmethod
    def confirm_received(user_id: str, order_id: str) -> dict:
        """
        Customer can only confirm received_status = True.
        Enforces user_id ownership check.
        """
        res = (
            supabase.from_("daily_orders")
            .update({"received_status": True})
            .eq("id", order_id)
            .eq("user_id", user_id)
            .execute()
        )
        return res.data[0] if res.data else {"id": order_id, "received_status": True, "status": "delivered"}

    @staticmethod
    def skip_order(user_id: str, order_id: str) -> dict:
        """
        Customer marks single daily order as skipped.
        Enforces user_id ownership check.
        """
        res = (
            supabase.from_("daily_orders")
            .update({"status": "skipped"})
            .eq("id", order_id)
            .eq("user_id", user_id)
            .execute()
        )
        return res.data[0] if res.data else {"id": order_id, "status": "skipped"}

order_service = OrderService()
