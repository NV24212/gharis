from supabase import Client
from typing import Optional, Dict, Any

class UserService:
    def __init__(self, db_client: Client):
        self.db = db_client

    def authenticate_user(self, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticates a user by checking if the password exists in the admins or students table.
        Returns a dictionary with user details including a 'role' if successful, otherwise None.
        """
        # Check if the password belongs to an admin
        admin_response = self.db.table("admins").select("id, role").eq("password", password).single().execute()
        if admin_response.data:
            return admin_response.data

        # Check if the password belongs to a student
        student_response = self.db.table("students").select("id, role").eq("password", password).single().execute()
        if student_response.data:
            return student_response.data

        return None