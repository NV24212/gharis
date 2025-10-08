from supabase import Client
from typing import Optional, Dict, Any

class UserService:
    def __init__(self, db_client: Client):
        self.db = db_client

    def authenticate_user(self, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticates a user by directly querying for the unique password.
        """
        # Check if the password belongs to an admin
        admin_response = self.db.table("admins").select("*").eq("password", password).execute()
        if admin_response.data:
            return admin_response.data[0]

        # Check if the password belongs to a student
        student_response = self.db.table("students").select("*").eq("password", password).execute()
        if student_response.data:
            return student_response.data[0]

        return None