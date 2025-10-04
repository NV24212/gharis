from pydantic import BaseModel
from typing import Optional

class ClassBase(BaseModel):
    name: str

class ClassCreate(ClassBase):
    pass

class ClassUpdate(BaseModel):
    name: Optional[str] = None

class ClassInDB(ClassBase):
    id: int

    class Config:
        from_attributes = True

class Class(ClassInDB):
    pass