from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.class import ClassCreate, ClassUpdate

class ClassService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.table_name = "classes"

    def create_class(self, class_in: ClassCreate) -> Optional[Dict[str, Any]]:
        """Creates a new class."""
        class_data = class_in.model_dump()
        try:
            response = self.db.table(self.table_name).insert(class_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            # Supabase might raise an exception on unique constraint violation
            print(f"Error creating class: {e}")
            return None

    def get_class_by_id(self, class_id: int) -> Optional[Dict[str, Any]]:
        """Retrieves a single class by its ID."""
        response = self.db.table(self.table_name).select("*").eq("id", class_id).single().execute()
        return response.data if response.data else None

    def get_all_classes(self) -> List[Dict[str, Any]]:
        """Retrieves all classes, ordered by name."""
        response = self.db.table(self.table_name).select("*").order("name").execute()
        return response.data if response.data else []

    def update_class(self, class_id: int, class_in: ClassUpdate) -> Optional[Dict[str, Any]]:
        """Updates a class's name."""
        update_data = class_in.model_dump(exclude_unset=True)
        if not update_data:
            return self.get_class_by_id(class_id)

        response = self.db.table(self.table_name).update(update_data).eq("id", class_id).execute()
        return response.data[0] if response.data else None

    def delete_class(self, class_id: int) -> Optional[Dict[str, Any]]:
        """Deletes a class."""
        response = self.db.table(self.table_name).delete().eq("id", class_id).execute()
        return response.data[0] if response.data else None