from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services.youtube_service import search_youtube_video


router = APIRouter(prefix="/youtube", tags=["youtube"])


class YouTubeSearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=200)


@router.post("/search")
async def youtube_search(payload: YouTubeSearchRequest) -> dict:
    result = await search_youtube_video(payload.query)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No video results found for query.",
        )
    return result

