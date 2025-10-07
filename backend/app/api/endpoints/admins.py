from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from supabase import Client

from app.schemas.user import AdminCreate, AdminInDB
from app.services.admin_service import AdminService
from app.api import deps

router = APIRouter()

@router.get("", response_model=List[AdminInDB])
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

@router.post("", response_model=AdminInDB, status_code=status.HTTP_201_CREATED)
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