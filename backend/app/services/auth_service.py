from fastapi import HTTPException, status

from app.db.mongodb import get_database
from app.models.user import UserCreate, UserInDB
from app.utils.security import hash_password, verify_password


async def create_user(payload: UserCreate) -> dict:
    db = get_database()
    existing_user = await db.users.find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )

    user = UserInDB(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    result = await db.users.insert_one(user.model_dump())

    return {
        "id": str(result.inserted_id),
        "name": user.name,
        "email": user.email,
    }


async def authenticate_user(email: str, password: str) -> dict:
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not registered. Please sign up first.",
        )
    if not verify_password(password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong credentials. Please check your password.",
        )
    return user


async def get_user_profile_by_email(email: str) -> dict:
    db = get_database()
    user = await db.users.find_one(
        {"email": email},
        {"_id": 1, "name": 1, "email": 1, "dna_profile": 1},
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "dna_profile": user.get("dna_profile"),
    }
