import json
import logging
import requests
from app.config import settings

logger = logging.getLogger(__name__)

class DirectTableQueryResult:
    def __init__(self, data=None):
        self.data = data

class DirectTableQuery:
    def __init__(self, base_url: str, key: str, table_name: str):
        self.base_url = base_url.rstrip("/")
        self.key = key
        self.table_name = table_name
        self.endpoint = f"{self.base_url}/rest/v1/{table_name}"
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }
        self.method = "GET"
        self.params = {}
        self.body = None
        self.is_single = False

    def select(self, columns: str = "*", *args, **kwargs):
        self.method = "GET"
        self.params["select"] = columns
        return self

    def insert(self, data, *args, **kwargs):
        self.method = "POST"
        self.body = data
        return self

    def update(self, data, *args, **kwargs):
        self.method = "PATCH"
        self.body = data
        return self

    def delete(self, *args, **kwargs):
        self.method = "DELETE"
        return self

    def eq(self, column: str, value: any):
        self.params[column] = f"eq.{value}"
        return self

    def gte(self, column: str, value: any):
        self.params[column] = f"gte.{value}"
        return self

    def lte(self, column: str, value: any):
        self.params[column] = f"lte.{value}"
        return self

    def order(self, column: str, desc: bool = False):
        direction = "desc" if desc else "asc"
        self.params["order"] = f"{column}.{direction}"
        return self

    def limit(self, count: int):
        self.params["limit"] = str(count)
        return self

    def single(self):
        self.is_single = True
        return self

    def execute(self) -> DirectTableQueryResult:
        try:
            if self.method == "GET":
                resp = requests.get(self.endpoint, headers=self.headers, params=self.params, timeout=10)
            elif self.method == "POST":
                resp = requests.post(self.endpoint, headers=self.headers, params=self.params, json=self.body, timeout=10)
            elif self.method == "PATCH":
                resp = requests.patch(self.endpoint, headers=self.headers, params=self.params, json=self.body, timeout=10)
            elif self.method == "DELETE":
                resp = requests.delete(self.endpoint, headers=self.headers, params=self.params, timeout=10)
            else:
                resp = requests.get(self.endpoint, headers=self.headers, params=self.params, timeout=10)

            if resp.status_code >= 400:
                logger.error(f"[DirectSupabaseClient] HTTP {resp.status_code} on {self.table_name}: {resp.text}")
                return DirectTableQueryResult(data=None if self.is_single else [])

            result_data = resp.json()
            if self.is_single:
                if isinstance(result_data, list):
                    item = result_data[0] if len(result_data) > 0 else None
                    return DirectTableQueryResult(data=item)
                return DirectTableQueryResult(data=result_data)

            return DirectTableQueryResult(data=result_data if isinstance(result_data, list) else [result_data])
        except Exception as e:
            logger.error(f"[DirectSupabaseClient] Error executing {self.method} on {self.table_name}: {e}")
            return DirectTableQueryResult(data=None if self.is_single else [])

class DirectAuthUser:
    def __init__(self, data: dict):
        self.id = data.get("id")
        self.email = data.get("email")
        self.user_metadata = data.get("user_metadata", {})

class DirectAuthSession:
    def __init__(self, access_token: str, refresh_token: str = None):
        self.access_token = access_token
        self.refresh_token = refresh_token

class DirectAuthResponse:
    def __init__(self, user: DirectAuthUser = None, session: DirectAuthSession = None):
        self.user = user
        self.session = session

class DirectAuth:
    def __init__(self, base_url: str, key: str):
        self.base_url = base_url.rstrip("/")
        self.key = key
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
        }

    def get_user(self, token: str) -> DirectAuthResponse:
        url = f"{self.base_url}/auth/v1/user"
        headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {token}",
        }
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                return DirectAuthResponse(user=DirectAuthUser(data))
        except Exception as e:
            logger.error(f"[DirectAuth] get_user error: {e}")
        return DirectAuthResponse(user=None)

    def sign_up(self, credentials: dict) -> DirectAuthResponse:
        url = f"{self.base_url}/auth/v1/signup"
        try:
            payload = {
                "email": credentials.get("email"),
                "password": credentials.get("password"),
                "data": credentials.get("options", {}).get("data", {}),
            }
            resp = requests.post(url, headers=self.headers, json=payload, timeout=10)
            if resp.status_code in (200, 201):
                data = resp.json()
                user = DirectAuthUser(data.get("user") or data)
                session_data = data.get("session")
                session = DirectAuthSession(
                    access_token=session_data.get("access_token") if session_data else data.get("access_token"),
                    refresh_token=session_data.get("refresh_token") if session_data else data.get("refresh_token")
                )
                return DirectAuthResponse(user=user, session=session)
            else:
                logger.error(f"[DirectAuth] sign_up error {resp.status_code}: {resp.text}")
                raise Exception(resp.json().get("msg") or resp.json().get("error_description") or resp.text)
        except Exception as e:
            logger.error(f"[DirectAuth] sign_up exception: {e}")
            raise

    def sign_in_with_password(self, credentials: dict) -> DirectAuthResponse:
        url = f"{self.base_url}/auth/v1/token?grant_type=password"
        try:
            payload = {
                "email": credentials.get("email"),
                "password": credentials.get("password"),
            }
            resp = requests.post(url, headers=self.headers, json=payload, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                user_data = data.get("user") or {}
                user = DirectAuthUser(user_data)
                session = DirectAuthSession(
                    access_token=data.get("access_token"),
                    refresh_token=data.get("refresh_token")
                )
                return DirectAuthResponse(user=user, session=session)
            else:
                err_msg = resp.json().get("error_description") or resp.json().get("msg") or "Invalid credentials"
                raise Exception(err_msg)
        except Exception as e:
            logger.error(f"[DirectAuth] sign_in error: {e}")
            raise

class DirectSupabaseClient:
    def __init__(self, base_url: str, key: str):
        self.base_url = base_url
        self.key = key
        self.auth = DirectAuth(base_url, key)

    def from_(self, table_name: str) -> DirectTableQuery:
        return DirectTableQuery(self.base_url, self.key, table_name)

    def table(self, table_name: str) -> DirectTableQuery:
        return DirectTableQuery(self.base_url, self.key, table_name)

def get_supabase_client():
    """
    Initializes Supabase Client using Service Role Key.
    If official client encounters format validation errors, utilizes DirectSupabaseClient.
    """
    try:
        from supabase import create_client
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        logger.info(f"DirectSupabaseClient active (HTTP REST Mode): {e}")
        return DirectSupabaseClient(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

supabase = get_supabase_client()
