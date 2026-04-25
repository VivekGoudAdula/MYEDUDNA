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
