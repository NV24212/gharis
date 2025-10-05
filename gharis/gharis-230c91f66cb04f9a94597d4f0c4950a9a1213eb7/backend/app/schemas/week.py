from pydantic import BaseModel
from typing import Optional, List

# Content Card Schemas
class ContentCardBase(BaseModel):
    title: str
    description: Optional[str] = None

class ContentCardCreate(ContentCardBase):
    pass

class ContentCardUpdate(ContentCardBase):
    pass

class ContentCardInDB(ContentCardBase):
    id: int
    week_id: int

    class Config:
        from_attributes = True

class ContentCard(ContentCardInDB):
    pass


# Week Schemas
class WeekBase(BaseModel):
    title: str
    week_number: int
    is_locked: bool = False

class WeekCreate(WeekBase):
    pass

class WeekUpdate(BaseModel):
    title: Optional[str] = None
    week_number: Optional[int] = None
    is_locked: Optional[bool] = None
    video_url: Optional[str] = None

class WeekInDB(WeekBase):
    id: int
    video_url: Optional[str] = None
    content_cards: List[ContentCard] = []

    class Config:
        from_attributes = True

class Week(WeekInDB):
    pass