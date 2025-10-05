from pydantic import BaseModel
from typing import Optional

class ClassBase(BaseModel):
    name: str

class ClassCreate(ClassBase):
    pass

class ClassUpdate(ClassBase):
    pass

class ClassInDBBase(ClassBase):
    id: int

    class Config:
        from_attributes = True

class Class(ClassInDBBase):
    pass