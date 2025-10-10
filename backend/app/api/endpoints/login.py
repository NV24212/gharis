from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any, Union

from app.services.user_service import UserService
from app.schemas.token import Token
from app.schemas.user import User, AdminInDB
from app.core.security import create_access_token
from app.api.deps import get_current_user
from app.db.supabase import get_supabase_client

router = APIRouter()

@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Any = Depends(get_supabase_client)
) -> Any:
    """
    OAuth2 compatible token login, gets an access token for future requests
    """
    user = UserService(db).authenticate_user(password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {
        "id": str(user['id']),
        "role": user['role'],
        "name": user.get("name"),
    }

    if user['role'] == 'admin':
        permissions = {
            "can_manage_admins": user.get("can_manage_admins"),
            "can_manage_classes": user.get("can_manage_classes"),
            "can_manage_students": user.get("can_manage_students"),
            "can_manage_weeks": user.get("can_manage_weeks"),
            "can_manage_points": user.get("can_manage_points"),
            "can_view_analytics": user.get("can_view_analytics"),
        }
        token_data.update(permissions)
    elif user['role'] == 'student':
        token_data["class"] = user.get("class")

    access_token = create_access_token(data=token_data)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=Union[User, AdminInDB])
def read_users_me(
    current_user: dict = Depends(get_current_user),
    db: Any = Depends(get_supabase_client)
):
    """
    Get current user.
    """
    user_service = UserService(db)
    if current_user.role == 'admin':
        user = user_service.get_admin(current_user.id)
    else:
        user = user_service.get_student(current_user.id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user