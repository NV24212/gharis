from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import Any
from supabase import Client
import uuid

from app.api import deps
from app.db.supabase import get_supabase_client
from app.services.student_service import StudentService
from app.services.admin_service import AdminService
from app.schemas.user import UserInDBBase, AdminInDB
from typing import Union

# This router is for actions the current user performs on their own profile
user_router = APIRouter()
# This router is for actions an admin performs on other users' profiles
admin_router = APIRouter()

@user_router.get("/", response_model=Union[AdminInDB, UserInDBBase])
def get_current_user_profile(
    *,
    db: Client = Depends(get_supabase_client),
    current_user: deps.TokenData = Depends(deps.get_current_user)
) -> Any:
    """
    Get the profile for the currently logged-in user.
    """
    user_id = int(current_user.id)
    role = current_user.role

    if role == "admin":
        service = AdminService(db)
        user_profile = service.get_admin_by_id(user_id)
        if not user_profile:
            raise HTTPException(status_code=404, detail="Admin profile not found")
        return AdminInDB.model_validate(user_profile)
    elif role == "student":
        service = StudentService(db)
        user_profile = service.get_student_by_id(user_id)
        if not user_profile:
            raise HTTPException(status_code=404, detail="Student profile not found")
        return UserInDBBase.model_validate(user_profile)
    else:
        raise HTTPException(status_code=403, detail="Invalid user role")

def _upload_avatar(db: Client, file: UploadFile, user_id: int, service: Any):
    """Helper function to upload a file to the 'avatars' bucket and update a user record."""
    # Generate a unique filename to avoid conflicts
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    try:
        # Read the file content as bytes before uploading
        file_content = file.file.read()

        # Upload to 'avatars' bucket
        db.storage.from_("avatars").upload(file=file_content, path=unique_filename, file_options={"content-type": file.content_type})

        # Get public URL
        public_url_data = db.storage.from_("avatars").get_public_url(unique_filename)

        # Update user's profile_pic_url
        service.update_profile_pic(user_id=user_id, url=public_url_data)

    except Exception as e:
        # Attempt to delete the uploaded file if the DB update fails
        try:
            db.storage.from_("avatars").remove(unique_filename)
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")

    return {"profile_pic_url": public_url_data}


@user_router.post("/upload-avatar", status_code=status.HTTP_200_OK)
def upload_current_user_avatar(
    *,
    db: Client = Depends(get_supabase_client),
    current_user: deps.TokenData = Depends(deps.get_current_user),
    file: UploadFile = File(...)
) -> Any:
    """
    Upload an avatar for the currently logged-in user (student or admin).
    """
    user_id = int(current_user.id)
    role = current_user.role

    service = None
    if role == "admin":
        service = AdminService(db)
    elif role == "student":
        service = StudentService(db)
    else:
        raise HTTPException(status_code=403, detail="Invalid user role")

    return _upload_avatar(db=db, file=file, user_id=user_id, service=service)


@admin_router.post("/students/{student_id}/upload-avatar", status_code=status.HTTP_200_OK, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_students"]))])
def upload_student_avatar_by_admin(
    *,
    db: Client = Depends(get_supabase_client),
    student_id: int,
    file: UploadFile = File(...)
) -> Any:
    """
    Upload an avatar for a specific student (Admin only).
    """
    service = StudentService(db)

    # Check if student exists
    student = service.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return _upload_avatar(db=db, file=file, user_id=student_id, service=service)