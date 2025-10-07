from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.user import AdminCreate
from app.core.security import get_password_hash

class AdminService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.table = "admins"

    def create_admin(self, admin_in: AdminCreate) -> Optional[Dict[str, Any]]:
        admin_data = {
            "name": admin_in.name,
            "password": get_password_hash(admin_in.password)
        }
        response = self.db.table(self.table).insert(admin_data).execute()
        return response.data[0] if response.data else None

    def get_all_admins(self) -> List[Dict[str, Any]]:
        response = self.db.table(self.table).select("id, name, created_at").execute()
        return response.data if response.data else []