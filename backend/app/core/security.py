from datetime import datetime, timedelta
from typing import Any

from jose import jwt
from app.core.config import settings

ALGORITHM = settings.ALGORITHM

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, password_in_db: str) -> bool:
    """
    Verifies a password by direct string comparison.
    """
    return plain_password == password_in_db

def get_password_hash(password: str) -> str:
    """
    This function no longer hashes the password. It returns it as is.
    """
    return password