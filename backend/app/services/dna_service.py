import json
from datetime import datetime, timezone

import httpx
from fastapi import HTTPException, status

from app.db.mongodb import get_database
from app.models.dna import DNAProfile
from app.utils.config import settings


def _fallback_profile(accuracy: float, avg_time: float) -> DNAProfile:
    if accuracy >= 80:
        level = "advanced"
        strengths = ["Logical reasoning", "Consistent accuracy"]
        weaknesses = ["Speed optimization"]
    elif accuracy >= 50:
        level = "intermediate"
        strengths = ["Core understanding", "Pattern recognition"]
        weaknesses = ["Accuracy consistency", "Time management"]
    else:
        level = "beginner"
        strengths = ["Learning potential"]
        weaknesses = ["Foundational concepts", "Answer confidence"]

    learning_style = "analytical" if avg_time <= 7 else "reflective"
    return DNAProfile(
        learningStyle=learning_style,
        strengths=strengths,
        weaknesses=weaknesses,
        level=level,
    )


async def fetch_questions_by_level(level: str) -> dict:
    db = get_database()
    document = await db.dna_questions.find_one({"level": level}, {"_id": 0})
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"No seeded questions found for level '{level}'. "
                "Run scripts/dna_seeder.py to seed all class and btech levels."
            ),
        )
    return document


def evaluate_answers(
    correct_answers: list[str], submitted_answers: list[str], timings: list[float]
) -> tuple[float, float]:
    if len(correct_answers) != len(submitted_answers) or len(correct_answers) != len(timings):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="answers and time_taken must match question count.",
        )

    total_questions = len(correct_answers)
    correct_count = sum(
        1 for expected, actual in zip(correct_answers, submitted_answers) if expected == actual
    )
    accuracy = round((correct_count / total_questions) * 100, 2)
    avg_time = round(sum(timings) / total_questions, 2)
    return accuracy, avg_time


async def analyze_with_groq(accuracy: float, avg_time: float) -> DNAProfile:
    if not settings.groq_api_key:
        return _fallback_profile(accuracy, avg_time)

    prompt = (
        "Analyze this student:\n"
        f"Accuracy: {accuracy}%\n"
        f"Avg Time: {avg_time} sec\n\n"
        "Return only JSON with keys:\n"
        "- learningStyle (string)\n"
        "- strengths (array of strings)\n"
        "- weaknesses (array of strings)\n"
        "- level (beginner/intermediate/advanced)"
    )

    payload = {
        "model": settings.groq_model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers=headers,
        )

    if response.status_code >= 400:
        return _fallback_profile(accuracy, avg_time)

    content = response.json()["choices"][0]["message"]["content"]

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        return _fallback_profile(accuracy, avg_time)

    try:
        return DNAProfile(**parsed)
    except Exception:
        return _fallback_profile(accuracy, avg_time)


async def store_dna_profile(
    user_email: str, payload: dict, answers: list[str], time_taken: list[float]
) -> None:
    db = get_database()
    dna_map = {
        "completed": True,
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "assessment": {
            "level": payload["level"],
            "answers": answers,
            "time_taken": time_taken,
            "accuracy": payload["accuracy"],
            "avg_time_per_question": payload["avg_time_per_question"],
            "profile": payload["profile"],
        },
    }
    result = await db.users.update_one(
        {"email": user_email},
        {
            "$set": {
                "dna_profile": payload,
                "dna_map": dna_map,
                "dna_completed": True,
            }
        },
        upsert=False,
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found for DNA profile storage.",
        )


async def get_ai_coach_insight(accuracy: float, labs_completed: int, learning_style: str) -> dict:
    if not settings.groq_api_key:
        return {
            "strength": "Consistent learning pace",
            "weakness": "Needs more practical application",
            "suggestion": "Try completing 2 more labs this week to reinforce concepts."
        }

    prompt = (
        "Analyze this student:\n"
        f"Accuracy: {accuracy}%\n"
        f"Labs Completed: {labs_completed}\n"
        f"Learning Style: {learning_style}\n\n"
        "Return only JSON with exactly these keys:\n"
        "- strength (string)\n"
        "- weakness (string)\n"
        "- suggestion (string)"
    )

    payload = {
        "model": settings.groq_model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers=headers,
        )

    if response.status_code >= 400:
        return {
            "strength": "Consistent learning pace",
            "weakness": "Needs more practical application",
            "suggestion": "Try completing 2 more labs this week to reinforce concepts."
        }

    content = response.json()["choices"][0]["message"]["content"]
    
    # Clean up markdown code block if present
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(content)
        return parsed
    except json.JSONDecodeError:
        return {
            "strength": "Consistent learning pace",
            "weakness": "Needs more practical application",
            "suggestion": "Try completing 2 more labs this week to reinforce concepts."
        }

