from pydantic import BaseModel, Field
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
    # Use an alias to allow the frontend to send 'unlocked'
    is_locked: bool = Field(True, alias='unlocked')

class WeekCreate(WeekBase):
    # Content cards are optional during creation, can be added later
    content_cards: List[ContentCardCreate] = []

class WeekUpdate(BaseModel):
    title: Optional[str] = None
    week_number: Optional[int] = None
    is_locked: Optional[bool] = Field(None, alias='unlocked')
    video_url: Optional[str] = None
    content_cards: Optional[List[ContentCardCreate]] = None

class WeekInDB(WeekBase):
    id: int
    video_url: Optional[str] = None
    content_cards: List[ContentCard] = []

    class Config:
        from_attributes = True

class Week(WeekInDB):
    pass