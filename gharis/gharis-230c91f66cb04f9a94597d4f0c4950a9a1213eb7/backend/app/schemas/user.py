from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    class_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    class_id: Optional[int] = None
    points: Optional[int] = None

class UserInDBBase(UserBase):
    id: int
    points: int

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class AdminBase(BaseModel):
    password: str

class AdminCreate(AdminBase):
    pass

class AdminInDB(AdminBase):
    id: int

    class Config:
        from_attributes = True