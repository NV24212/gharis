from typing import Any, Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from supabase import Client

from app.core import security
from app.core.config import settings
from app.db.supabase import get_supabase_client
from app.schemas.token import TokenData

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/token"
)

def get_current_user(
    db: Client = Depends(get_supabase_client), token: str = Depends(reusable_oauth2)
) -> Any:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenData(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    # In a real app, you'd fetch the user from the DB to ensure they still exist.
    # For this project, we'll trust the token's payload.
    return token_data

def get_current_admin_user(
    current_user: TokenData = Depends(get_current_user),
) -> TokenData:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user