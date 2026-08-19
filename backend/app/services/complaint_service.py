from app.supabase_client import supabase

class ComplaintService:
    @staticmethod
    def create_complaint(user_id: str, order_id: str, description: str) -> dict:
        complaint_record = {
            "user_id": user_id,
            "order_id": order_id,
            "description": description,
            "status": "pending",
        }
        res = supabase.from_("complaints").insert(complaint_record).execute()
        return res.data[0] if res.data else complaint_record

    @staticmethod
    def get_user_complaints(user_id: str) -> list:
        res = (
            supabase.from_("complaints")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return res.data or []

    @staticmethod
    def get_complaint_by_id(user_id: str, complaint_id: str) -> dict:
        res = (
            supabase.from_("complaints")
            .select("*")
            .eq("id", complaint_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        return res.data or {}

complaint_service = ComplaintService()
