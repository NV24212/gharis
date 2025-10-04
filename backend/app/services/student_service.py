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
        Password is not hashed as per original project spec.
        """
        student_data = student_in.model_dump()
        response = self.db.table(self.table).insert(student_data).execute()

        if not response.data:
            return None

        # Return the newly created student with class name
        return self.get_student_by_id(response.data[0]['id'])

    def get_all_students(self) -> List[Dict[str, Any]]:
        """Retrieves all students from the database with their class name."""
        # The query now joins with the 'classes' table to fetch the class name
        response = self.db.table(self.table).select("id, name, points, class_id, classes(name)").order("points", desc=True).execute()

        if not response.data:
            return []

        # Process the data to flatten the class name
        students = response.data
        for student in students:
            if student.get('classes') and student['classes'] is not None:
                student['class_name'] = student['classes']['name']
            else:
                student['class_name'] = None
            if 'classes' in student:
                del student['classes'] # Clean up the nested object

        return students

    def get_student_by_id(self, student_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve a single student by ID with their class name."""
        response = self.db.table(self.table).select("id, name, points, class_id, classes(name)").eq("id", student_id).single().execute()

        if not response.data:
            return None

        student = response.data
        if student.get('classes') and student['classes'] is not None:
            student['class_name'] = student['classes']['name']
        else:
            student['class_name'] = None
        if 'classes' in student:
            del student['classes']

        return student

    def update_student(self, student_id: int, student_update: UserUpdate) -> Optional[Dict[str, Any]]:
        """Updates a student's information."""
        update_data = student_update.model_dump(exclude_unset=True)

        if 'password' in update_data and update_data['password']:
            pass
        elif 'password' in update_data:
            # Don't update password if it's an empty string
            del update_data['password']

        if not update_data:
            return self.get_student_by_id(student_id)

        response = self.db.table(self.table).update(update_data).eq("id", student_id).execute()

        if not response.data:
            return None

        return self.get_student_by_id(response.data[0]['id'])

    def delete_student(self, student_id: int) -> Optional[Dict[str, Any]]:
        """Deletes a student from the database."""
        student_to_delete = self.get_student_by_id(student_id)
        if not student_to_delete:
            return None

        response = self.db.table(self.table).delete().eq("id", student_id).execute()

        if response.data:
            return student_to_delete
        return None