from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ghars Project"
    API_V1_STR: str = "/api/v1"

    # The frontend URL that will be allowed to make requests to the backend
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # Supabase configuration will be added here later
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_BUCKET: str = "videos"

    # Security settings
    SECRET_KEY: str = "a_very_secret_key_that_should_be_changed" # This should be loaded from an environment variable
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days

    class Config:
        case_sensitive = True

settings = Settings()