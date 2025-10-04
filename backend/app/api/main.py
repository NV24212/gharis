from fastapi import APIRouter

from .endpoints import login, students, weeks

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(weeks.router, prefix="/weeks", tags=["weeks"])