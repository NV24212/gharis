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
    is_locked: bool = True

class WeekCreate(WeekBase):
    pass

class WeekUpdate(BaseModel):
    title: Optional[str] = None
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