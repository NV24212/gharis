from fastapi import APIRouter

from app.schemas.week import Week
from app.schemas.user import User
from typing import List
from .endpoints import login, students, weeks, classes, admins

api_router = APIRouter()

# --- Admin API Router ---
# This router groups all endpoints that require admin authentication.
admin_router = APIRouter()
admin_router.include_router(students.admin_router, prefix="/students", tags=["Admin Students"])
admin_router.include_router(weeks.admin_router, prefix="/weeks", tags=["Admin Weeks"])
admin_router.include_router(classes.router, prefix="/classes", tags=["Admin Classes"])
admin_router.include_router(admins.router, prefix="/admins", tags=["Admin Admins"])


# --- Top-Level API Router ---
# Include the login router, which is public.
api_router.include_router(login.router, tags=["Login"])

# Include the admin router under the /admin prefix. All routes within it will inherit this prefix.
api_router.include_router(admin_router, prefix="/admin")

# Include the student-specific router for their dashboard.
api_router.include_router(students.student_router, prefix="/dashboard", tags=["Student Dashboard"])

# Include the public-facing routers for weeks and the leaderboard at the root level.
api_router.include_router(weeks.public_router, prefix="/weeks", tags=["Public Weeks"])
api_router.include_router(students.public_router, prefix="/leaderboard", tags=["Public Leaderboard"])