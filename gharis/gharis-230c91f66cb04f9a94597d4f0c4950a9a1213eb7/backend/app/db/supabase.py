from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """
    Returns a Supabase client instance.

    Note: This is a simple implementation for demonstration. In a production
    application, you might want to manage the client lifecycle more carefully,
    for example, by creating a single client instance that is reused across
    the application.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise ValueError("Supabase URL and Key must be set in environment variables.")

    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return supabase