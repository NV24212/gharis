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
        admin_response = self.db.table("admins").select("id, password").eq("password", password).execute()
        if admin_response.data:
            user_data = admin_response.data[0]
            return {"id": user_data["id"], "role": "admin"}

        # Check if the password belongs to a student
        student_response = self.db.table("students").select("id, password").eq("password", password).execute()
        if student_response.data:
            user_data = student_response.data[0]
            return {"id": user_data["id"], "role": "student"}

        return None