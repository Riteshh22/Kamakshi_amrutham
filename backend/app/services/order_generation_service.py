from datetime import datetime
from app.supabase_client import supabase

class OrderGenerationService:
    @staticmethod
    def generate_daily_orders_for_today() -> dict:
        """
        Backend-authoritative daily order generation service.
        1. Checks active subscriptions.
        2. Validates start_date <= today <= end_date.
        3. Checks if today is inside a subscription_pauses date range.
        4. Prevents creating duplicate daily orders.
        """
        today_str = datetime.now().strftime("%Y-%m-%d")
        created_count = 0

        try:
            # Query active subscriptions
            subs_res = supabase.from_("subscriptions").select("*, profile:Profiles(*)").eq("status", "active").execute()
            active_subs = subs_res.data or []

            for sub in active_subs:
                user_id = sub.get("user_id")
                sub_id = sub.get("id")

                # Check date range validity
                start_date = sub.get("start_date")
                end_date = sub.get("end_date")
                if start_date and today_str < start_date:
                    continue
                if end_date and today_str > end_date:
                    continue

                # Check if user has paused for today
                pause_res = (
                    supabase.from_("subscription_pauses")
                    .select("*")
                    .eq("subscription_id", sub_id)
                    .lte("start_date", today_str)
                    .gte("end_date", today_str)
                    .execute()
                )
                if pause_res.data and len(pause_res.data) > 0:
                    continue

                # Check if order already exists for today
                existing_res = (
                    supabase.from_("daily_orders")
                    .select("id")
                    .eq("subscription_id", sub_id)
                    .eq("date", today_str)
                    .execute()
                )
                if existing_res.data and len(existing_res.data) > 0:
                    continue

                # Create daily order
                profile = sub.get("profile") or {}
                new_order = {
                    "user_id": user_id,
                    "subscription_id": sub_id,
                    "date": today_str,
                    "status": "pending",
                    "received_status": False,
                    "delivery_address": profile.get("delivery_address", "Saved Address"),
                    "area": profile.get("area", "Kukatpally"),
                }

                supabase.from_("daily_orders").insert(new_order).execute()
                created_count += 1

        except Exception as e:
            print(f"Error in order_generation_service: {e}")

        return {"generated_count": created_count, "date": today_str}

order_generation_service = OrderGenerationService()
