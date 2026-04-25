from fastapi import APIRouter, Depends, HTTPException, status

from app.models.roadmap import RoadmapGenerateRequest
from app.services.course_service import (
    ensure_course_for_module,
    get_first_module_from_roadmap,
    get_roadmap_by_id,
)
from app.services.roadmap_service import (
    generate_roadmap_with_groq,
    get_latest_roadmap_for_user,
    get_user_dna_for_roadmap,
    get_user_id_by_email,
    store_roadmap,
)
from app.utils.security import get_current_user_email

router = APIRouter(prefix="/roadmap", tags=["roadmap"])


@router.post("/generate")
async def generate_roadmap(
    payload: RoadmapGenerateRequest,
    current_user_email: str = Depends(get_current_user_email),
) -> dict:
    user_id = await get_user_id_by_email(current_user_email)
    existing_roadmap = await get_latest_roadmap_for_user(user_id)
    if existing_roadmap is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Roadmap already exists for this user. Fetch the existing roadmap.",
        )

    effective_dna_profile = payload.dna_profile
    if effective_dna_profile is None:
        effective_dna_profile = await get_user_dna_for_roadmap(current_user_email)

    roadmap = await generate_roadmap_with_groq(
        goal=payload.goal, dna_profile=effective_dna_profile
    )
    stored = await store_roadmap(
        goal=payload.goal,
        dna_profile=effective_dna_profile,
        roadmap=roadmap,
        user_id=user_id,
    )
    first_module_name = get_first_module_from_roadmap(stored)
    if first_module_name:
        roadmap_doc = await get_roadmap_by_id(stored["id"])
        await ensure_course_for_module(
            roadmap_id=stored["id"],
            module_name=first_module_name,
            roadmap=roadmap_doc,
        )
    return {
        "user_id": stored["user_id"],
        "goal": stored["goal"],
        "roadmap": stored["roadmap"],
        "roadmap_id": stored["id"],
        "created_at": stored["created_at"],
    }


@router.get("/latest")
async def latest_roadmap(
    current_user_email: str = Depends(get_current_user_email),
) -> dict:
    user_id = await get_user_id_by_email(current_user_email)
    latest = await get_latest_roadmap_for_user(user_id)
    if latest is None:
        return {"roadmap": None}
    return {
        "user_id": latest["user_id"],
        "goal": latest["goal"],
        "roadmap": latest["roadmap"],
        "roadmap_id": latest["id"],
        "created_at": latest["created_at"],
    }
