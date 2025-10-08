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
    profile_pic_url: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    points: int
    profile_pic_url: Optional[str] = None
    class_info: Optional[Class] = Field(None, alias='class')

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class AdminBase(BaseModel):
    name: str
    profile_pic_url: Optional[str] = None
    can_manage_admins: bool = True
    can_manage_classes: bool = True
    can_manage_students: bool = True
    can_manage_weeks: bool = True
    can_manage_points: bool = True


class AdminCreate(AdminBase):
    password: str


class AdminUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    profile_pic_url: Optional[str] = None
    can_manage_admins: Optional[bool] = None
    can_manage_classes: Optional[bool] = None
    can_manage_students: Optional[bool] = None
    can_manage_weeks: Optional[bool] = None
    can_manage_points: Optional[bool] = None


class AdminInDB(AdminBase):
    id: int

    class Config:
        from_attributes = True