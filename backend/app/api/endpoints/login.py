from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any

from app.services.user_service import UserService
from app.schemas.token import Token
from app.core.security import create_access_token
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
    # In a password-only flow, the password is sent in the 'username' field.
    user = UserService(db).authenticate_user(password=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {"id": str(user['id']), "role": user['role']}
    if user['role'] == 'admin':
        permissions = {
            "can_manage_admins": user.get("can_manage_admins"),
            "can_manage_classes": user.get("can_manage_classes"),
            "can_manage_students": user.get("can_manage_students"),
            "can_manage_weeks": user.get("can_manage_weeks"),
            "can_manage_points": user.get("can_manage_points"),
        }
        token_data.update(permissions)

    access_token = create_access_token(data=token_data)
    return {"access_token": access_token, "token_type": "bearer"}