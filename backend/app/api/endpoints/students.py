from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from supabase import Client

from app.schemas.user import User, UserCreate, UserUpdate
from app.services.student_service import StudentService
from app.api import deps

router = APIRouter()

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_student(
    *,
    db: Client = Depends(deps.get_supabase_client),
    student_in: UserCreate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Create new student.
    """
    student_service = StudentService(db)
    student = student_service.create_student(student_in=student_in)
    if not student:
        raise HTTPException(
            status_code=400,
            detail="Could not create student. The password might already exist.",
        )
    return student

@router.get("/", response_model=List[User])
def read_students(
    db: Client = Depends(deps.get_supabase_client),
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Retrieve all students.
    """
    student_service = StudentService(db)
    return student_service.get_all_students()

@router.put("/{student_id}", response_model=User)
def update_student(
    *,
    db: Client = Depends(deps.get_supabase_client),
    student_id: int,
    student_in: UserUpdate,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Update a student's points, name, or class.
    """
    student_service = StudentService(db)
    student = student_service.get_student_by_id(student_id=student_id)
    if not student:
        raise HTTPException(
            status_code=404,
            detail="The student with this ID does not exist in the system",
        )
    updated_student = student_service.update_student(student_id=student_id, student_update=student_in)
    return updated_student

@router.delete("/{student_id}", response_model=User)
def delete_student(
    *,
    db: Client = Depends(deps.get_supabase_client),
    student_id: int,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Delete a student.
    """
    student_service = StudentService(db)
    student = student_service.get_student_by_id(student_id=student_id)
    if not student:
        raise HTTPException(
            status_code=404,
            detail="The student with this ID does not exist in the system",
        )
    deleted_student = student_service.delete_student(student_id=student_id)
    return deleted_student