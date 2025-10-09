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
        student_response = self.db.table("students").select("*, class:classes(id, name)").eq("password", password).execute()
        if student_response.data:
            student = student_response.data[0]
            # Also fetch and attach the points for the student
            points_response = self.db.table("points").select("value").eq("student_id", student['id']).execute()
            total_points = sum(item['value'] for item in points_response.data) if points_response.data else 0
            student['points'] = total_points
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

        # Get and sum points
        points_response = self.db.table("points").select("value").eq("student_id", user_id).execute()
        total_points = sum(item['value'] for item in points_response.data) if points_response.data else 0

        student['points'] = total_points

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