from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.user import AdminCreate, AdminUpdate
from app.core.security import get_password_hash

class AdminService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.table = "admins"

    def create_admin(self, admin_in: AdminCreate) -> Optional[Dict[str, Any]]:
        admin_data = admin_in.model_dump()
        admin_data["password"] = get_password_hash(admin_in.password)
        response = self.db.table(self.table).insert(admin_data).execute()
        return response.data[0] if response.data else None

    def get_admin_by_id(self, admin_id: int) -> Optional[Dict[str, Any]]:
        response = self.db.table(self.table).select("*").eq("id", admin_id).execute()
        return response.data[0] if response.data else None

    def get_all_admins(self) -> List[Dict[str, Any]]:
        response = self.db.table(self.table).select("*").execute()
        return response.data if response.data else []

    def update_admin(self, admin_id: int, admin_in: AdminUpdate) -> Optional[Dict[str, Any]]:
        update_data = admin_in.model_dump(exclude_unset=True)
        if "password" in update_data and update_data["password"]:
            update_data["password"] = get_password_hash(update_data["password"])

        response = self.db.table(self.table).update(update_data).eq("id", admin_id).execute()
        return response.data[0] if response.data else None