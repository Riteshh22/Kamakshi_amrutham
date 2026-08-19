from datetime import datetime, timedelta

PLAN_DURATIONS = {
    "daily": 1,
    "monthly": 30,
    "quarterly": 90,
    "3_months": 90,
}

def calculate_end_date(start_date: datetime, plan_type: str) -> datetime:
    """
    Backend calculates subscription expiry dates.
    Daily = 1 day, Monthly = 30 days, 3 Months = 90 days.
    """
    days = PLAN_DURATIONS.get(plan_type.lower(), 30)
    return start_date + timedelta(days=days)
