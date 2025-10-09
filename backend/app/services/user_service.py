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
            admin = admin_response.data[0]
            admin['role'] = 'admin'
            return admin

        # Check if the password belongs to a student
        student_response = self.db.table("students").select("*, class:classes(id, name)").eq("password", password).execute()
        if student_response.data:
            student = student_response.data[0]
            student['role'] = 'student'
            return student

        return None

    def get_student(self, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Get a single student by ID, including their total points.
        """
        student_response = self.db.table("students").select("*, class:classes(id, name)").eq("id", user_id).single().execute()
        if not student_response.data:
            return None

        student = student_response.data
        student['role'] = 'student'

        return student

    def get_admin(self, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Get a single admin by ID.
        """
        response = self.db.table("admins").select("*").eq("id", user_id).single().execute()
        if not response.data:
            return None
        admin = response.data
        admin['role'] = 'admin'
        return admin