from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from supabase import Client

from app.schemas.user import AdminCreate, AdminInDB, AdminUpdate
from app.services.admin_service import AdminService
from app.api import deps

router = APIRouter()

@router.get("", response_model=List[AdminInDB], dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_admins"]))])
def read_admins(
    *,
    db: Client = Depends(deps.get_supabase_client),
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Retrieve all admin users.
    """
    admin_service = AdminService(db)
    return admin_service.get_all_admins()

@router.post("", response_model=AdminInDB, status_code=status.HTTP_201_CREATED, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_admins"]))])
def create_admin(
    *,
    db: Client = Depends(deps.get_supabase_client),
    admin_in: AdminCreate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Create a new admin user.
    """
    admin_service = AdminService(db)
    admin = admin_service.create_admin(admin_in=admin_in)
    if not admin:
        raise HTTPException(
            status_code=400,
            detail="Could not create admin user.",
        )
    return admin

@router.put("/{admin_id}", response_model=AdminInDB, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_admins"]))])
def update_admin(
    *,
    db: Client = Depends(deps.get_supabase_client),
    admin_id: int,
    admin_in: AdminUpdate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Update an admin user's details.
    """
    admin_service = AdminService(db)
    admin = admin_service.get_admin_by_id(admin_id=admin_id)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found",
        )
    updated_admin = admin_service.update_admin(admin_id=admin_id, admin_in=admin_in)
    return updated_admin