from fastapi import APIRouter, Depends

from app.models.user import TokenResponse, UserCreate, UserLogin
from app.services.auth_service import (
    authenticate_user,
    create_user,
    get_user_profile_by_email,
)
from app.utils.security import create_access_token, get_current_user_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=201)
async def signup(payload: UserCreate) -> dict:
    created_user = await create_user(payload)
    return {
        "message": "User created successfully.",
        "user": created_user,
    }


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin) -> TokenResponse:
    user = await authenticate_user(payload.email, payload.password)
    token = create_access_token(subject=user["email"])
    return TokenResponse(access_token=token)


@router.get("/me")
async def me(current_user_email: str = Depends(get_current_user_email)) -> dict:
    return await get_user_profile_by_email(current_user_email)
