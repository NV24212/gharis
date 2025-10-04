from pydantic import BaseModel
from typing import Optional

# Base for student data sent from the client
class UserBase(BaseModel):
    name: str
    class_id: Optional[int] = None

# Schema for creating a student
class UserCreate(UserBase):
    password: str
    points: int = 0

# Schema for updating a student
class UserUpdate(BaseModel):
    name: Optional[str] = None
    class_id: Optional[int] = None
    points: Optional[int] = None
    password: Optional[str] = None

# Base schema for data returned from the DB
class UserInDBBase(BaseModel):
    id: int
    name: str
    points: int
    class_id: Optional[int] = None
    # This will be populated by the service from the join
    class_name: Optional[str] = None

    class Config:
        from_attributes = True

# Public-facing user schema
class User(UserInDBBase):
    pass

# Admin schemas remain the same
class AdminBase(BaseModel):
    password: str

class AdminCreate(AdminBase):
    pass

class AdminInDB(AdminBase):
    id: int

    class Config:
        from_attributes = True