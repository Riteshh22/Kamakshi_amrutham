import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://your-supabase-project.supabase.co")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key-placeholder")
    # Secret used to sign backend-issued admin session tokens
    ADMIN_JWT_SECRET: str = os.getenv("ADMIN_JWT_SECRET", "kamakshi-amrutham-admin-secret-change-in-prod")

    @property
    def ALLOWED_ORIGINS(self) -> list:
        env_origins = os.getenv("ALLOWED_ORIGINS")
        if env_origins:
            return [origin.strip() for origin in env_origins.split(",") if origin.strip()]
        return [
            "https://kamakshi-amrutham-9ah1.vercel.app",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]

settings = Settings()
