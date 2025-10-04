from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.class_schema import ClassCreate

class ClassService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.table = "classes"

    def create_class(self, class_in: ClassCreate) -> Optional[Dict[str, Any]]:
        """Creates a new class in the database."""
        class_data = class_in.model_dump()
        response = self.db.table(self.table).insert(class_data).execute()
        if response.data:
            return response.data[0]
        return None

    def get_all_classes(self) -> List[Dict[str, Any]]:
        """Retrieves all classes from the database."""
        response = self.db.table(self.table).select("*").execute()
        return response.data if response.data else []

    def delete_class(self, class_id: int) -> Optional[Dict[str, Any]]:
        """Deletes a class from the database."""
        response = self.db.table(self.table).delete().eq("id", class_id).execute()
        if response.data:
            return response.data[0]
        return None