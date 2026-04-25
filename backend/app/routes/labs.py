from fastapi import APIRouter, Depends

from app.models.lab import LabSessionCreateRequest
from app.services.lab_service import create_lab_session
from app.utils.security import get_current_user_email

router = APIRouter(prefix="/labs", tags=["labs"])


@router.post("/session")
async def create_session(
    payload: LabSessionCreateRequest,
    current_user_email: str = Depends(get_current_user_email),
) -> dict:
    return await create_lab_session(current_user_email, payload.model_dump())
