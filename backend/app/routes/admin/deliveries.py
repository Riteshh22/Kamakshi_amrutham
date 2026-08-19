import logging
from fastapi import APIRouter, Depends
from app.dependencies.admin import require_admin
from app.supabase_client import supabase
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/deliveries", tags=["Admin Deliveries"])

HYDERABAD_AREAS = [
    "Kukatpally", "Madhapur", "Ameerpet", "Miyapur",
    "Gachibowli", "Kondapur", "Hitec City", "Jubilee Hills",
    "Banjara Hills", "Begumpet", "KPHB Colony", "Manikonda",
]


@router.get("")
async def get_admin_deliveries(admin: dict = Depends(require_admin)):
    """
    Returns today's delivery breakdown per Hyderabad area.
    Data is computed live from daily_orders — no hardcoded values.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")

    try:
        res = supabase.from_("daily_orders").select("area, status").eq("date", today_str).execute()
        orders = res.data or []
    except Exception as e:
        logger.error(f"[GET /api/admin/deliveries] Supabase error: {e}")
        orders = []

    # Aggregate counts by area
    area_map: dict[str, dict] = {}
    for o in orders:
        area = o.get("area") or "Unknown"
        if area not in area_map:
            area_map[area] = {
                "area": area,
                "total_orders": 0,
                "delivered": 0,
                "out_for_delivery": 0,
                "preparing": 0,
                "pending": 0,
                "skipped": 0,
            }
        area_map[area]["total_orders"] += 1
        status = o.get("status", "pending")
        if status == "delivered":
            area_map[area]["delivered"] += 1
        elif status == "out_for_delivery":
            area_map[area]["out_for_delivery"] += 1
        elif status == "preparing":
            area_map[area]["preparing"] += 1
        elif status == "skipped":
            area_map[area]["skipped"] += 1
        else:
            area_map[area]["pending"] += 1

    # Return results sorted by total_orders descending
    result = sorted(area_map.values(), key=lambda x: x["total_orders"], reverse=True)
    return result
