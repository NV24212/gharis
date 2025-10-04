from fastapi import APIRouter, Depends, status
from typing import List, Any
from supabase import Client

from app.schemas.class_schema import Class, ClassCreate
from app.services.class_service import ClassService
from app.api import deps

router = APIRouter()

@router.post("", response_model=Class, status_code=status.HTTP_201_CREATED)
def create_class(
    *,
    db: Client = Depends(deps.get_supabase_client),
    class_in: ClassCreate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Create a new class (Admin only).
    """
    class_service = ClassService(db)
    new_class = class_service.create_class(class_in=class_in)
    return new_class

@router.get("", response_model=List[Class])
def read_classes(
    db: Client = Depends(deps.get_supabase_client),
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Retrieve all classes (Admin only).
    """
    class_service = ClassService(db)
    return class_service.get_all_classes()

@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(
    *,
    db: Client = Depends(deps.get_supabase_client),
    class_id: int,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> None:
    """
    Delete a class (Admin only).
    """
    class_service = ClassService(db)
    class_service.delete_class(class_id=class_id)
    return None