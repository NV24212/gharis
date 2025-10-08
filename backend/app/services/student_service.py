from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.user import UserCreate, UserUpdate

class StudentService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.table = "students"

    def create_student(self, student_in: UserCreate) -> Optional[Dict[str, Any]]:
        student_data = student_in.model_dump()
        response = self.db.table(self.table).insert(student_data).execute()
        if response.data:
            return response.data[0]
        return None

    def get_all_students(self) -> List[Dict[str, Any]]:
        """
        Retrieves all students from the database with their class name.
        """
        response = self.db.table(self.table).select("id, name, points, class_id, class:classes(id, name)").order("points", desc=True).execute()
        return response.data if response.data else []

    def get_student_by_id(self, student_id: int) -> Optional[Dict[str, Any]]:
        """
        Retrieves a single student by their ID with their class name.
        """
        response = self.db.table(self.table).select("id, name, points, class_id, class:classes(id, name)").eq("id", student_id).single().execute()
        return response.data if response.data else None

    def update_student(self, student_id: int, student_update: UserUpdate) -> Optional[Dict[str, Any]]:
        update_data = student_update.model_dump(exclude_unset=True)

        if not update_data:
            return None

        # Don't update password if it's not provided or empty
        if 'password' in update_data and not update_data['password']:
            update_data.pop('password', None)

        if not update_data:
            return self.get_student_by_id(student_id)

        update_response = self.db.table(self.table).update(update_data).eq("id", student_id).execute()

        if update_response.data:
            return self.get_student_by_id(student_id)

        return None

    def add_points(self, student_id: int, points_to_add: int) -> Optional[Dict[str, Any]]:
        """
        Adds points to a student's current score.
        """
        student = self.get_student_by_id(student_id)
        if not student:
            return None

        current_points = student.get("points", 0)
        new_points = current_points + points_to_add

        response = self.db.table(self.table).update({"points": new_points}).eq("id", student_id).execute()
        if response.data:
            return response.data[0]
        return None

    def delete_student(self, student_id: int) -> Optional[Dict[str, Any]]:
        response = self.db.table(self.table).delete().eq("id", student_id).execute()
        if response.data:
            return response.data[0]
        return None