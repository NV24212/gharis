from fastapi import APIRouter

from .endpoints import login, students, weeks, classes

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(weeks.router, prefix="/weeks", tags=["weeks"])
api_router.include_router(classes.router, prefix="/classes", tags=["classes"])