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
    user = UserService(db).authenticate_user(password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": str(user['id']), "role": user['role']}
    )
    return {"access_token": access_token, "token_type": "bearer"}