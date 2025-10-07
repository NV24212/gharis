from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash

class StudentService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.table = "students"

    def create_student(self, student_in: UserCreate) -> Optional[Dict[str, Any]]:
        student_data = student_in.model_dump()
        student_data['password'] = get_password_hash(student_data['password'])
        response = self.db.table(self.table).insert(student_data).execute()
        if response.data:
            return response.data[0]
        return None

    def get_all_students(self) -> List[Dict[str, Any]]:
        """
        Retrieves all students from the database with their class name.
        The foreign key table is 'classes', but we alias it to 'class' for clarity.
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
            return None # No data to update

        # Hash password if it's being updated
        if 'password' in update_data and update_data['password']:
            update_data['password'] = get_password_hash(update_data['password'])
        else:
            # Don't update password if it's not provided or empty
            update_data.pop('password', None)

        if not update_data:
            # This can happen if only an empty password was passed
            return self.get_student_by_id(student_id)

        response = self.db.table(self.table).update(update_data).eq("id", student_id).select("id, name, points, class_id, class:classes(id, name)").single().execute()

        if response.data:
            return response.data
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