from fastapi import APIRouter, Depends
from typing import Any

from app.api import deps
from app.services.analytics import get_analytics_report

router = APIRouter()

@router.get("", response_model=Any, dependencies=[Depends(deps.PermissionChecker(required_permissions=["can_view_analytics"]))])
def get_analytics_data(
    *,
    current_user: Any = Depends(deps.get_current_admin_user)
) -> Any:
    """
    Retrieve Google Analytics data.
    Accessible only to admins with 'can_view_analytics' permission.
    """
    report = get_analytics_report()
    return report