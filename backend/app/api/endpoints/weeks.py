from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Any
from supabase import Client

from app.schemas.week import Week, WeekCreate, WeekUpdate
from app.services.week_service import WeekService
from app.api import deps
from app.core.config import settings

# Router for admin-only week operations
admin_router = APIRouter()
# Router for public-facing week operations
public_router = APIRouter()


# --- Public Week Endpoints ---

@public_router.get("", response_model=List[Week])
def read_weeks(
    db: Client = Depends(deps.get_supabase_client)
) -> Any:
    """
    Retrieve all unlocked weeks with their content for the public.
    """
    week_service = WeekService(db)
    all_weeks = week_service.get_all_weeks_with_content()
    # Filter for unlocked weeks
    return [week for week in all_weeks if not week.get('is_locked')]

@public_router.get("/{week_id}", response_model=Week)
def read_week(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_id: int
) -> Any:
    """
    Get a specific week by ID. If the week is locked, it will not be returned
    unless a user with student credentials requests it (logic to be handled by frontend).
    """
    week_service = WeekService(db)
    week = week_service.get_week_by_id(week_id=week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    # Public can only see unlocked weeks. Frontend will handle this based on the is_locked flag.
    # We return the week regardless, and let the frontend decide.
    return week


# --- Admin Week Endpoints ---

@admin_router.post("", response_model=Week, status_code=status.HTTP_201_CREATED)
def create_week(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_in: WeekCreate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Create a new week, including its content cards (Admin only).
    """
    week_service = WeekService(db)
    week = week_service.create_week(week_in=week_in)
    if not week:
        raise HTTPException(status_code=400, detail="Could not create week.")
    return week

@admin_router.get("/all", response_model=List[Week])
def read_all_weeks_for_admin(
    db: Client = Depends(deps.get_supabase_client),
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Retrieve all weeks (locked and unlocked) for the admin panel.
    """
    week_service = WeekService(db)
    return week_service.get_all_weeks_with_content()

@admin_router.put("/{week_id}", response_model=Week)
def update_week(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_id: int,
    week_in: WeekUpdate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Update a week's details and its content cards (Admin only).
    """
    week_service = WeekService(db)
    updated_week = week_service.update_week(week_id=week_id, week_in=week_in)
    if not updated_week:
        raise HTTPException(status_code=404, detail="Week not found")
    return updated_week

@admin_router.delete("/{week_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_week_endpoint(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_id: int,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> None:
    """
    Delete a week and all of its content (Admin only).
    """
    week_service = WeekService(db)
    deleted_week = week_service.delete_week(week_id=week_id)
    if not deleted_week:
        raise HTTPException(status_code=404, detail="Week not found")

@admin_router.post("/{week_id}/video", response_model=Week)
def upload_week_video(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_id: int,
    file: UploadFile = File(...),
    current_user: Any = Depends(deps.get_current_admin_user)
):
    """
    Upload a video for a week (Admin only).
    """
    week_service = WeekService(db)
    if not week_service.get_week_by_id(week_id):
        raise HTTPException(status_code=404, detail="Week not found")

    updated_week = week_service.upload_video(week_id, file, settings.SUPABASE_BUCKET)
    return updated_week