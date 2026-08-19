import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://your-supabase-project.supabase.co")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key-placeholder")
    # Secret used to sign backend-issued admin session tokens
    ADMIN_JWT_SECRET: str = os.getenv("ADMIN_JWT_SECRET", "kamakshi-amrutham-admin-secret-change-in-prod")
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

settings = Settings()
