from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from supabase import Client

from app.schemas.class import Class, ClassCreate, ClassUpdate
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
    Create a new class.
    """
    class_service = ClassService(db)
    # Check for uniqueness
    existing_classes = class_service.get_all_classes()
    if any(c['name'] == class_in.name for c in existing_classes):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A class with this name already exists."
        )
    new_class = class_service.create_class(class_in=class_in)
    if not new_class:
        raise HTTPException(status_code=400, detail="Could not create class.")
    return new_class

@router.get("", response_model=List[Class])
def read_classes(
    db: Client = Depends(deps.get_supabase_client)
    # This endpoint is accessible to any authenticated user (admin or student)
    # to populate dropdowns, etc. If it should be admin-only, add:
    # current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Retrieve all classes.
    """
    class_service = ClassService(db)
    return class_service.get_all_classes()

@router.put("/{class_id}", response_model=Class)
def update_class(
    *,
    db: Client = Depends(deps.get_supabase_client),
    class_id: int,
    class_in: ClassUpdate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Update a class's name.
    """
    class_service = ClassService(db)
    existing_class = class_service.get_class_by_id(class_id)
    if not existing_class:
        raise HTTPException(status_code=404, detail="Class not found")

    updated_class = class_service.update_class(class_id=class_id, class_in=class_in)
    return updated_class

@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(
    *,
    db: Client = Depends(deps.get_supabase_client),
    class_id: int,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> None:
    """
    Delete a class.
    """
    class_service = ClassService(db)
    existing_class = class_service.get_class_by_id(class_id)
    if not existing_class:
        raise HTTPException(status_code=404, detail="Class not found")

    class_service.delete_class(class_id=class_id)