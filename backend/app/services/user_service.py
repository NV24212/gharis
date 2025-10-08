from supabase import Client
from typing import Optional, Dict, Any
from app.core.security import verify_password

class UserService:
    def __init__(self, db_client: Client):
        self.db = db_client

    def authenticate_user(self, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticates a user by password only.
        This is inefficient as it fetches all users, but it's necessary because
        passwords are the unique identifier and are hashed in the database.
        """
        # Check admins
        admins_response = self.db.table("admins").select("*").execute()
        if admins_response.data:
            for user in admins_response.data:
                if "password" in user and verify_password(password, user["password"]):
                    return user

        # Check students
        students_response = self.db.table("students").select("*").execute()
        if students_response.data:
            for user in students_response.data:
                if "password" in user and verify_password(password, user["password"]):
                    return user

        return None