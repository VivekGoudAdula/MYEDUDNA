from fastapi import APIRouter, Depends, HTTPException, status

from app.models.course import CourseCompleteRequest, CourseGenerateRequest
from app.services.course_service import list_courses_for_user
from app.services.course_service import (
    ensure_course_for_module,
    get_course_by_roadmap_and_module,
    get_roadmap_modules,
    get_roadmap_by_id,
    mark_course_completed,
)
from app.services.roadmap_service import get_user_id_by_email
from app.utils.security import get_current_user_email

router = APIRouter(prefix="/course", tags=["course"])


@router.post("/generate")
async def generate_course(
    payload: CourseGenerateRequest,
    current_user_email: str = Depends(get_current_user_email),
) -> dict:
    user_id = await get_user_id_by_email(current_user_email)
    roadmap = await get_roadmap_by_id(payload.roadmap_id)
    if roadmap.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to generate course for this roadmap.",
        )
    roadmap_modules = get_roadmap_modules(roadmap)
    if payload.module_name not in roadmap_modules:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "module_name is not part of the selected roadmap modules.",
                "roadmap_modules": roadmap_modules,
            },
        )
    existing = await get_course_by_roadmap_and_module(payload.roadmap_id, payload.module_name)
    if existing is not None:
        stored = existing
    else:
        stored = await ensure_course_for_module(
            roadmap_id=payload.roadmap_id,
            module_name=payload.module_name,
            roadmap=roadmap,
        )
    return {
        "course_id": stored["id"],
        "user_id": stored["user_id"],
        "module_name": stored["module_name"],
        "roadmap_id": stored["roadmap_id"],
        "course": stored["course"],
        "is_completed": stored.get("is_completed", False),
        "completed_at": stored.get("completed_at"),
        "created_at": stored["created_at"],
    }


@router.get("/my")
async def my_courses(
    current_user_email: str = Depends(get_current_user_email),
) -> dict:
    user_id = await get_user_id_by_email(current_user_email)
    courses = await list_courses_for_user(user_id)
    return {"courses": courses}


@router.post("/complete")
async def complete_course(
    payload: CourseCompleteRequest,
    current_user_email: str = Depends(get_current_user_email),
) -> dict:
    user_id = await get_user_id_by_email(current_user_email)
    updated = await mark_course_completed(
        user_id=user_id,
        course_id=payload.course_id,
        module_name=payload.module_name,
        roadmap_id=payload.roadmap_id,
    )
    return {
        "course_id": updated["id"],
        "user_id": updated["user_id"],
        "module_name": updated["module_name"],
        "roadmap_id": updated["roadmap_id"],
        "is_completed": updated["is_completed"],
        "completed_at": updated["completed_at"],
        "created_at": updated["created_at"],
    }
