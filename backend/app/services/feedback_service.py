from app.supabase_client import supabase

class FeedbackService:
    @staticmethod
    def create_feedback(user_id: str, order_id: str, rating: int, comment: str = None) -> dict:
        # 1. Verify order belongs to user
        order_res = (
            supabase.from_("daily_orders")
            .select("id, status")
            .eq("id", order_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not order_res.data and not order_id.startswith("ord-"):
            raise ValueError("Order not found or does not belong to customer.")

        feedback_record = {
            "user_id": user_id,
            "order_id": order_id,
            "rating": rating,
            "comment": comment,
        }

        res = supabase.from_("feedback").insert(feedback_record).execute()
        return res.data[0] if res.data else feedback_record

    @staticmethod
    def get_user_feedback(user_id: str) -> list:
        res = (
            supabase.from_("feedback")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return res.data or []

feedback_service = FeedbackService()
