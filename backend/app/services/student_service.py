from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash

class StudentService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.table = "students"

    def create_student(self, student_in: UserCreate) -> Optional[Dict[str, Any]]:
        """
        Creates a new student in the database.
        As per the project requirements, the password is not hashed.
        In a real-world scenario, you would hash the password.
        """
        student_data = student_in.model_dump()
        # student_data['password'] = get_password_hash(student_in.password) # Hashing is disabled as per spec
        response = self.db.table(self.table).insert(student_data).execute()
        if response.data:
            return response.data[0]
        return None

    def get_all_students(self) -> List[Dict[str, Any]]:
        """Retrieves all students from the database."""
        response = self.db.table(self.table).select("id, name, class_id, points").order("points", desc=True).execute()
        return response.data if response.data else []

    def get_student_by_id(self, student_id: int) -> Optional[Dict[str, Any]]:
        """Retrieves a single student by their ID."""
        response = self.db.table(self.table).select("id, name, class_id, points").eq("id", student_id).single().execute()
        return response.data if response.data else None

    def update_student(self, student_id: int, student_update: UserUpdate) -> Optional[Dict[str, Any]]:
        """Updates a student's information."""
        update_data = student_update.model_dump(exclude_unset=True)
        if not update_data:
            return None # Nothing to update
        response = self.db.table(self.table).update(update_data).eq("id", student_id).execute()
        if response.data:
            return response.data[0]
        return None

    def delete_student(self, student_id: int) -> Optional[Dict[str, Any]]:
        """Deletes a student from the database."""
        response = self.db.table(self.table).delete().eq("id", student_id).execute()
        if response.data:
            return response.data[0]
        return None