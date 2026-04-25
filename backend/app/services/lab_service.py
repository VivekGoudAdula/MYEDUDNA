from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.db.mongodb import get_database


async def create_lab_session(user_email: str, payload: dict) -> dict:
    db = get_database()
    user = await db.users.find_one({"email": user_email}, {"_id": 1, "email": 1})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    document = {
        "user_id": str(user["_id"]),
        "user_email": user["email"],
        "experiment": payload["experiment"],
        "result": payload["result"],
        "score": payload["score"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.lab_results.insert_one(document)
    return {
        "session_id": str(result.inserted_id),
        "experiment": document["experiment"],
        "result": document["result"],
        "score": document["score"],
        "user_id": document["user_id"],
        "created_at": document["created_at"],
    }
