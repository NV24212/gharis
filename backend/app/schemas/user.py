from pydantic import BaseModel, Field
from typing import Optional
from .class_schema import Class

class UserBase(BaseModel):
    name: str
    class_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    class_id: Optional[int] = None
    points: Optional[int] = None

class UserInDBBase(UserBase):
    id: int
    points: int
    class_info: Optional[Class] = Field(None, alias='class')

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class AdminBase(BaseModel):
    name: str

class AdminCreate(AdminBase):
    password: str

class AdminInDB(AdminBase):
    id: int

    class Config:
        from_attributes = True