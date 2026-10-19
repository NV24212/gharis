from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union, Optional, Any
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ghars Project"
    API_V1_STR: str = ""

    # The frontend URL that will be allowed to make requests to the backend
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "https://gharis.vercel.app",
        "https://gharis-etar.vercel.app",
        "https://ghars.hasmah.xyz",
        "https://ghars.site",
        "http://localhost:3000",
        "http://localhost:5173",
        "*"
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> Union[List[str], str]:
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return ["*"]
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except Exception:
                    pass
            if "," in v:
                return [i.strip() for i in v.split(",") if i.strip()]
            return [v]
        elif isinstance(v, (list, tuple)):
            return [str(i).strip() for i in v if str(i).strip()]
        return ["*"]

    # Supabase configuration
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_BUCKET: str = "videos"

    # Security settings
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days

    # Google Analytics Configuration
    GA_PROPERTY_ID: str = "508192372"
    GA4_PROJECT_ID: Optional[str] = None
    GA4_CLIENT_EMAIL: Optional[str] = None
    GA4_PRIVATE_KEY: Optional[str] = None

    class Config:
        case_sensitive = True

settings = Settings()