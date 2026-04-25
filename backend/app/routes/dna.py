from fastapi import APIRouter, Depends

from app.models.dna import DNASubmitRequest, DNASubmitResponse, DNAQuestionsResponse
from app.services.dna_service import (
    analyze_with_groq,
    evaluate_answers,
    fetch_questions_by_level,
    store_dna_profile,
)
from app.utils.security import get_current_user_email

router = APIRouter(prefix="/dna", tags=["dna"])


@router.get("/questions", response_model=DNAQuestionsResponse)
async def get_questions(level: str) -> DNAQuestionsResponse:
    document = await fetch_questions_by_level(level)
    sanitized_questions = [
        {
            "question": item["question"],
            "options": item["options"],
            "category": item["category"],
        }
        for item in document["questions"]
    ]
    return DNAQuestionsResponse(level=document["level"], questions=sanitized_questions)


@router.post("/submit", response_model=DNASubmitResponse)
async def submit_dna(
    payload: DNASubmitRequest,
    current_user_email: str = Depends(get_current_user_email),
) -> DNASubmitResponse:
    document = await fetch_questions_by_level(payload.level)
    correct_answers = [item["answer"] for item in document["questions"]]
    accuracy, avg_time = evaluate_answers(
        correct_answers=correct_answers,
        submitted_answers=payload.answers,
        timings=payload.time_taken,
    )
    profile = await analyze_with_groq(accuracy=accuracy, avg_time=avg_time)

    result = {
        "level": payload.level,
        "accuracy": accuracy,
        "avg_time_per_question": avg_time,
        "profile": profile.model_dump(),
    }
    await store_dna_profile(
        current_user_email,
        result,
        answers=payload.answers,
        time_taken=payload.time_taken,
    )
    return DNASubmitResponse(**result)


@router.get("/coach/insight")
async def get_coach_insight(current_user_email: str = Depends(get_current_user_email)):
    from app.db.mongodb import get_database
    db = get_database()
    
    # Fetch user data
    user = await db.users.find_one({"email": current_user_email})
    if not user:
        return {
            "strength": "Ready to learn",
            "weakness": "Needs initial assessment",
            "suggestion": "Take the DNA assessment to unlock personalized insights."
        }
        
    dna_map = user.get("dna_map", {})
    assessment = dna_map.get("assessment", {})
    profile = assessment.get("profile", {})
    
    accuracy = assessment.get("accuracy", 0)
    learning_style = profile.get("learningStyle", "unknown")
    
    # Count labs
    labs_completed = await db.user_courses.count_documents({
        "user_id": str(user["_id"]), 
        "module_name": {"$regex": "(?i)lab"}
    })
    
    # Fallback to dummy data if no labs but need some count
    if labs_completed == 0:
        labs_completed = 2  # Fake it a bit as per user's "fake if needed" for demo

    from app.services.dna_service import get_ai_coach_insight
    insight = await get_ai_coach_insight(accuracy, labs_completed, learning_style)
    return insight
