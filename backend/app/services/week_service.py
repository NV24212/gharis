import os
from supabase import Client
from typing import List, Optional, Dict, Any
from app.schemas.week import WeekCreate, WeekUpdate, ContentCardCreate, ContentCardUpdate
from fastapi import UploadFile
import uuid

class WeekService:
    def __init__(self, db_client: Client):
        self.db = db_client
        self.weeks_table = "weeks"
        self.cards_table = "content_cards"

    # Week Management
    def create_week(self, week_in: WeekCreate) -> Optional[Dict[str, Any]]:
        response = self.db.table(self.weeks_table).insert(week_in.model_dump()).execute()
        return response.data[0] if response.data else None

    def get_all_weeks_with_content(self) -> List[Dict[str, Any]]:
        weeks_response = self.db.table(self.weeks_table).select("*").order("id").execute()
        if not weeks_response.data:
            return []

        weeks = weeks_response.data
        for week in weeks:
            cards_response = self.db.table(self.cards_table).select("*").eq("week_id", week["id"]).execute()
            week["content_cards"] = cards_response.data if cards_response.data else []

        return weeks

    def get_week_by_id(self, week_id: int) -> Optional[Dict[str, Any]]:
        response = self.db.table(self.weeks_table).select("*").eq("id", week_id).single().execute()
        if not response.data:
            return None

        week = response.data
        cards_response = self.db.table(self.cards_table).select("*").eq("week_id", week["id"]).execute()
        week["content_cards"] = cards_response.data if cards_response.data else []

        return week

    def update_week(self, week_id: int, week_in: WeekUpdate) -> Optional[Dict[str, Any]]:
        update_data = week_in.model_dump(exclude_unset=True)
        if not update_data:
            return self.get_week_by_id(week_id)
        response = self.db.table(self.weeks_table).update(update_data).eq("id", week_id).execute()
        return response.data[0] if response.data else None

    def delete_week(self, week_id: int) -> Optional[Dict[str, Any]]:
        # The database is set to cascade deletes, so cards will be deleted automatically.
        response = self.db.table(self.weeks_table).delete().eq("id", week_id).execute()
        return response.data[0] if response.data else None

    def upload_video(self, week_id: int, file: UploadFile, bucket_name: str) -> Optional[Dict[str, Any]]:
        _, file_extension = os.path.splitext(file.filename)
        file_path = f"week_{week_id}/{uuid.uuid4()}{file_extension}"

        # Upload to Supabase Storage
        self.db.storage.from_(bucket_name).upload(file_path, file.file.read(), {"contentType": file.content_type})

        # Get public URL
        public_url = self.db.storage.from_(bucket_name).get_public_url(file_path)

        # Update the week's video_url
        return self.update_week(week_id, WeekUpdate(video_url=public_url))

    # Content Card Management
    def add_card_to_week(self, week_id: int, card_in: ContentCardCreate) -> Optional[Dict[str, Any]]:
        card_data = card_in.model_dump()
        card_data["week_id"] = week_id
        response = self.db.table(self.cards_table).insert(card_data).execute()
        return response.data[0] if response.data else None

    def update_card(self, card_id: int, card_in: ContentCardUpdate) -> Optional[Dict[str, Any]]:
        update_data = card_in.model_dump(exclude_unset=True)
        response = self.db.table(self.cards_table).update(update_data).eq("id", card_id).execute()
        return response.data[0] if response.data else None

    def delete_card(self, card_id: int) -> Optional[Dict[str, Any]]:
        response = self.db.table(self.cards_table).delete().eq("id", card_id).execute()
        return response.data[0] if response.data else None