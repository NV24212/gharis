from pydantic_settings import BaseSettings
from typing import List, Union
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ghars Project"
    API_V1_STR: str = "/api/v1"

    # The frontend URL that will be allowed to make requests to the backend
    BACKEND_CORS_ORIGINS: List[str] = ["https://ghars.hasmah.xyz", "https://ghars.site"]

    # Supabase configuration
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_BUCKET: str = "videos"

    # Security settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days

    # Google Analytics Configuration
    GA_PROPERTY_ID: str = "451406458"
    GA_SERVICE_ACCOUNT_CREDENTIALS: Union[str, None] = None

    class Config:
        case_sensitive = True

settings = Settings()