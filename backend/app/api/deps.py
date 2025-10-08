from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from typing import Optional, List

from app.core.config import settings
from app.db.supabase import get_supabase_client
from app.services.user_service import UserService

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/login/token")

class TokenData(BaseModel):
    id: Optional[str] = None
    role: Optional[str] = None
    can_manage_admins: Optional[bool] = None
    can_manage_classes: Optional[bool] = None
    can_manage_students: Optional[bool] = None
    can_manage_weeks: Optional[bool] = None
    can_manage_points: Optional[bool] = None

def get_current_user(token: str = Depends(reusable_oauth2)):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenData(**payload)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    return token_data

def get_current_admin_user(current_user: TokenData = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

class PermissionChecker:
    def __init__(self, required_permissions: List[str]):
        self.required_permissions = required_permissions

    def __call__(self, current_user: TokenData = Depends(get_current_admin_user)):
        for permission in self.required_permissions:
            if not getattr(current_user, permission, False):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Not enough permissions. Requires: {permission}",
                )
        return current_user