from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from supabase import Client

from app.schemas.user import User, UserCreate, UserUpdate
from app.schemas.points import PointsAdd
from app.services.student_service import StudentService
from app.api import deps

# Router for admin-only student operations
admin_router = APIRouter()
# Router for public-facing student operations
public_router = APIRouter()
# Router for authenticated student operations
student_router = APIRouter()


@admin_router.post("", response_model=User, status_code=status.HTTP_201_CREATED, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_students"]))])
def create_student(
    *,
    db: Client = Depends(deps.get_supabase_client),
    student_in: UserCreate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Create new student (Admin only).
    """
    student_service = StudentService(db)
    student = student_service.create_student(student_in=student_in)
    if not student:
        raise HTTPException(
            status_code=400,
            detail="Could not create student. The password might already exist.",
        )
    return student

@student_router.get("/me", response_model=User)
def read_student_me(
    db: Client = Depends(deps.get_supabase_client),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get current logged-in student's data.
    """
    student_service = StudentService(db)
    student = student_service.get_student_by_id(student_id=current_user.id)
    return student

@admin_router.get("", response_model=List[User], dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_students"]))])
def read_students(
    db: Client = Depends(deps.get_supabase_client),
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Retrieve all students (Admin only).
    """
    student_service = StudentService(db)
    return student_service.get_all_students()


@admin_router.put("/{student_id}", response_model=User, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_students"]))])
def update_student(
    *,
    db: Client = Depends(deps.get_supabase_client),
    student_id: int,
    student_in: UserUpdate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Update a student's info (Admin only).
    """
    student_service = StudentService(db)
    student = student_service.get_student_by_id(student_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    updated_student = student_service.update_student(student_id=student_id, student_update=student_in)
    return updated_student

@admin_router.post("/{student_id}/add-points", response_model=User, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_points"]))])
def add_student_points(
    *,
    db: Client = Depends(deps.get_supabase_client),
    student_id: int,
    points_in: PointsAdd,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Add points to a student's score (Admin only).
    """
    student_service = StudentService(db)
    student = student_service.get_student_by_id(student_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    updated_student = student_service.add_points(student_id=student_id, points_to_add=points_in.points)
    if not updated_student:
        raise HTTPException(status_code=400, detail="Could not add points to student.")
    return updated_student

@admin_router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_manage_students"]))])
def delete_student(
    *,
    db: Client = Depends(deps.get_supabase_client),
    student_id: int,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> None:
    """
    Delete a student (Admin only).
    """
    student_service = StudentService(db)
    student_to_delete = student_service.get_student_by_id(student_id=student_id)
    if not student_to_delete:
        raise HTTPException(status_code=404, detail="Student not found")

    student_service.delete_student(student_id=student_id)


# --- Public Endpoint ---

@public_router.get("/", response_model=List[User])
def read_leaderboard(
    db: Client = Depends(deps.get_supabase_client),
) -> Any:
    """
    Retrieve the top students for the public leaderboard.
    """
    student_service = StudentService(db)
    return student_service.get_all_students()