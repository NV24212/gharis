from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.user import AdminCreate, AdminUpdate

class AdminService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.table = "admins"

    def create_admin(self, admin_in: AdminCreate) -> Optional[Dict[str, Any]]:
        admin_data = admin_in.model_dump()
        response = self.db.table(self.table).insert(admin_data).execute()
        if response.data:
            admin = response.data[0]
            return self.get_admin_by_id(admin['id'])
        return None

    def get_admin_by_id(self, admin_id: int) -> Optional[Dict[str, Any]]:
        response = self.db.table(self.table).select("*").eq("id", admin_id).single().execute()
        if response.data:
            admin = response.data
            admin['role'] = 'admin'
            return admin
        return None

    def get_all_admins(self) -> List[Dict[str, Any]]:
        response = self.db.table(self.table).select("*").execute()
        admins = response.data if response.data else []
        for admin in admins:
            admin['role'] = 'admin'
        return admins

    def update_admin(self, admin_id: int, admin_in: AdminUpdate) -> Optional[Dict[str, Any]]:
        update_data = admin_in.model_dump(exclude_unset=True)

        # Don't update password if it's not provided or is an empty string
        if 'password' in update_data and not update_data['password']:
            update_data.pop('password')

        if not update_data:
            return self.get_admin_by_id(admin_id)

        response = self.db.table(self.table).update(update_data).eq("id", admin_id).execute()
        if response.data:
            return self.get_admin_by_id(admin_id)
        return None

    def delete_admin(self, admin_id: int) -> None:
        self.db.table(self.table).delete().eq("id", admin_id).execute()