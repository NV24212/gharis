from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.main import api_router

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.options("/{path:path}")
async def options_handler(request: Request, path: str):
    """Handle OPTIONS requests for CORS preflight"""
    return {"status": "ok"}

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ghars Project API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "cors_origins": settings.BACKEND_CORS_ORIGINS}