from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Any
from supabase import Client

from app.schemas.week import Week, WeekCreate, WeekUpdate, ContentCard, ContentCardCreate, ContentCardUpdate
from app.services.week_service import WeekService
from app.api import deps
from app.core.config import settings

router = APIRouter()

# --- Week Endpoints ---

@router.post("", response_model=Week, status_code=status.HTTP_201_CREATED)
def create_week(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_in: WeekCreate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Create a new week.
    """
    week_service = WeekService(db)
    week = week_service.create_week(week_in=week_in)
    return week_service.get_week_by_id(week["id"]) # Return the full week object with empty cards list

@router.get("/", response_model=List[Week])
def read_weeks(
    db: Client = Depends(deps.get_supabase_client)
) -> Any:
    """
    Retrieve all weeks with their content.
    """
    week_service = WeekService(db)
    return week_service.get_all_weeks_with_content()

@router.get("/all", response_model=List[Week])
def read_all_weeks(
    db: Client = Depends(deps.get_supabase_client),
) -> Any:
    """
    Retrieve all weeks with their content.
    """
    week_service = WeekService(db)
    return week_service.get_all_weeks_with_content()

@router.get("/{week_id}", response_model=Week)
def read_week(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_id: int
) -> Any:
    """
    Get a specific week by ID, if it's not locked.
    """
    week_service = WeekService(db)
    week = week_service.get_week_by_id(week_id=week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    if week["is_locked"]:
         # For now, we allow fetching locked weeks, frontend will handle the display logic.
         # In a stricter setup, we might raise an HTTPException here for non-admins.
         pass
    return week

@router.put("/{week_id}", response_model=Week)
def update_week(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_id: int,
    week_in: WeekUpdate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Update a week's details (title, lock status).
    """
    week_service = WeekService(db)
    updated_week = week_service.update_week(week_id=week_id, week_in=week_in)
    if not updated_week:
        raise HTTPException(status_code=404, detail="Week not found")
    return week_service.get_week_by_id(updated_week["id"])

@router.post("/{week_id}/video", response_model=Week)
def upload_week_video(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_id: int,
    file: UploadFile = File(...),
    current_user: Any = Depends(deps.get_current_admin_user)
):
    """
    Upload a video for a week.
    """
    week_service = WeekService(db)
    if not week_service.get_week_by_id(week_id):
        raise HTTPException(status_code=404, detail="Week not found")

    updated_week = week_service.upload_video(week_id, file, settings.SUPABASE_BUCKET)
    return week_service.get_week_by_id(updated_week["id"])

# --- Content Card Endpoints ---

@router.post("/{week_id}/cards", response_model=ContentCard)
def create_content_card(
    *,
    db: Client = Depends(deps.get_supabase_client),
    week_id: int,
    card_in: ContentCardCreate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Add a new content card to a week.
    """
    week_service = WeekService(db)
    if not week_service.get_week_by_id(week_id):
        raise HTTPException(status_code=404, detail="Week not found")

    card = week_service.add_card_to_week(week_id=week_id, card_in=card_in)
    return card

@router.put("/cards/{card_id}", response_model=ContentCard)
def update_content_card(
    *,
    db: Client = Depends(deps.get_supabase_client),
    card_id: int,
    card_in: ContentCardUpdate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Update a content card.
    """
    week_service = WeekService(db)
    # We don't need to check for card existence here, service will return None if not found
    card = week_service.update_card(card_id=card_id, card_in=card_in)
    if not card:
        raise HTTPException(status_code=404, detail="Content card not found")
    return card

@router.delete("/cards/{card_id}", response_model=ContentCard)
def delete_content_card(
    *,
    db: Client = Depends(deps.get_supabase_client),
    card_id: int,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Delete a content card.
    """
    week_service = WeekService(db)
    card = week_service.delete_card(card_id=card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Content card not found")
    return card