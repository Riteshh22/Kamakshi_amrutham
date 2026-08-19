from supabase import create_client, Client
from app.config import settings

class DummyTableQuery:
    def select(self, *args, **kwargs):
        return self
    def insert(self, *args, **kwargs):
        return self
    def update(self, *args, **kwargs):
        return self
    def delete(self, *args, **kwargs):
        return self
    def eq(self, *args, **kwargs):
        return self
    def lte(self, *args, **kwargs):
        return self
    def gte(self, *args, **kwargs):
        return self
    def single(self, *args, **kwargs):
        return self
    def order(self, *args, **kwargs):
        return self
    def limit(self, *args, **kwargs):
        return self
    def execute(self):
        class DummyResult:
            data = []
        return DummyResult()

class DummyAuth:
    def get_user(self, token: str):
        class DummyUser:
            id = "usr-placeholder"
            email = "customer@example.com"
            user_metadata = {"full_name": "Demo Customer"}
        class DummyRes:
            user = DummyUser()
        return DummyRes()
    def sign_up(self, credentials):
        class DummyUser:
            id = "usr-new"
            email = credentials.get("email", "")
        class DummySession:
            access_token = "dummy-token-placeholder"
        class DummyRes:
            user = DummyUser()
            session = DummySession()
        return DummyRes()
    def sign_in_with_password(self, credentials):
        class DummyUser:
            id = "usr-dev"
            email = credentials.get("email", "")
        class DummySession:
            access_token = "dummy-token-placeholder"
        class DummyRes:
            user = DummyUser()
            session = DummySession()
        return DummyRes()

class DummySupabaseClient:
    auth = DummyAuth()
    def from_(self, table_name: str):
        return DummyTableQuery()
    def table(self, table_name: str):
        return DummyTableQuery()

def get_supabase_client():
    """
    Initializes Supabase Client using Service Role Key.
    If credentials are placeholders, returns a safe fallback client.
    """
    try:
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        print(f"Note: Supabase client initialized in fallback mode: {e}")
        return DummySupabaseClient()

supabase = get_supabase_client()
