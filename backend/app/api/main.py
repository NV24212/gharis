from fastapi import APIRouter

from app.schemas.week import Week
from app.schemas.user import User
from typing import List
from .endpoints import login, students, weeks, classes

api_router = APIRouter()

# --- Admin API Router ---
# This router groups all endpoints that require admin authentication.
admin_router = APIRouter()
admin_router.include_router(students.admin_router, prefix="/students", tags=["Admin Students"])
admin_router.include_router(weeks.admin_router, prefix="/weeks", tags=["Admin Weeks"])
admin_router.include_router(classes.router, prefix="/classes", tags=["Admin Classes"])

# --- Top-Level API Router ---
# Include the login router, which is public.
api_router.include_router(login.router, prefix="/token", tags=["Login"])

# Include the admin router under the /admin prefix. All routes within it will inherit this prefix.
api_router.include_router(admin_router, prefix="/admin")

# --- Public API Router ---
# This router groups all endpoints that do not require authentication.
public_router = APIRouter()
public_router.include_router(weeks.public_router, prefix="/weeks", tags=["Public Weeks"])
public_router.include_router(students.public_router, prefix="/students", tags=["Public Students"])

api_router.include_router(public_router)