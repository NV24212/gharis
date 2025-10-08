from fastapi import APIRouter, Depends, status, HTTPException
from typing import List, Any
from supabase import Client

from app.schemas.class_schema import Class, ClassCreate, ClassUpdate
from app.services.class_service import ClassService
from app.api import deps
from app.db.supabase import get_supabase_client

router = APIRouter()

@router.post("", response_model=Class, status_code=status.HTTP_201_CREATED, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_classes"]))])
def create_class(
    *,
    db: Client = Depends(get_supabase_client),
    class_in: ClassCreate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Create a new class (Admin only).
    """
    class_service = ClassService(db)
    new_class = class_service.create_class(class_in=class_in)
    return new_class

@router.get("", response_model=List[Class], dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_classes"]))])
def read_classes(
    db: Client = Depends(get_supabase_client),
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Retrieve all classes (Admin only).
    """
    class_service = ClassService(db)
    return class_service.get_all_classes()

@router.put("/{class_id}", response_model=Class, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_classes"]))])
def update_class(
    *,
    db: Client = Depends(get_supabase_client),
    class_id: int,
    class_in: ClassUpdate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Update a class's info (Admin only).
    """
    class_service = ClassService(db)
    updated_class = class_service.update_class(class_id=class_id, class_in=class_in)
    if not updated_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return updated_class

@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_classes"]))])
def delete_class(
    *,
    db: Client = Depends(get_supabase_client),
    class_id: int,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> None:
    """
    Delete a class (Admin only).
    """
    class_service = ClassService(db)
    class_service.delete_class(class_id=class_id)
    return None