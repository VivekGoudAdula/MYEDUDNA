import json
from datetime import datetime, timezone

import httpx
from bson import ObjectId
from fastapi import HTTPException, status

from app.db.mongodb import get_database
from app.models.roadmap import RoadmapResult
from app.utils.config import settings


def _extract_json_object(text: str) -> dict | None:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        parts = cleaned.split("```")
        for part in parts:
            candidate = part.strip()
            if not candidate:
                continue
            if candidate.startswith("json"):
                candidate = candidate[4:].strip()
            try:
                parsed = json.loads(candidate)
                if isinstance(parsed, dict):
                    return parsed
            except json.JSONDecodeError:
                continue
        return None

    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        return None
    return None


async def generate_roadmap_with_groq(goal: str, dna_profile: dict) -> RoadmapResult:
    if not settings.groq_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GROQ_API_KEY is not configured.",
        )

    prompt = (
        "You are an AI career planner.\n\n"
        "User DNA:\n"
        f"{json.dumps(dna_profile, ensure_ascii=True)}\n\n"
        "Goal:\n"
        f"{goal}\n\n"
        "Generate structured roadmap:\n\n"
        "Return JSON:\n"
        "{\n"
        '  "phases": [\n'
        "    {\n"
        '      "title": "Phase 1",\n'
        '      "modules": ["..."]\n'
        "    }\n"
        "  ]\n"
        "}"
    )

    payload = {
        "model": settings.groq_model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
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
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Groq request failed: {response.text[:300]}",
        )

    content = response.json()["choices"][0]["message"]["content"]
    parsed = _extract_json_object(content)
    if parsed is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Groq returned non-JSON roadmap response.",
        )

    try:
        return RoadmapResult(**parsed)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Groq roadmap JSON is invalid: {str(exc)}",
        ) from exc


async def get_user_id_by_email(user_email: str) -> str:
    db = get_database()
    user = await db.users.find_one({"email": user_email}, {"_id": 1})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return str(user["_id"])


async def get_user_dna_for_roadmap(user_email: str) -> dict:
    db = get_database()
    user = await db.users.find_one(
        {"email": user_email},
        {"dna_map": 1, "dna_profile": 1},
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    dna_map = user.get("dna_map")
    if isinstance(dna_map, dict):
        assessment = dna_map.get("assessment", {})
        profile = assessment.get("profile")
        if dna_map.get("completed") and isinstance(profile, dict):
            return profile

    dna_profile = user.get("dna_profile")
    if isinstance(dna_profile, dict) and isinstance(dna_profile.get("profile"), dict):
        return dna_profile["profile"]

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="DNA profiling not completed. Complete DNA quiz before generating roadmap.",
    )


async def store_roadmap(
    goal: str, dna_profile: dict, roadmap: RoadmapResult, user_id: str
) -> dict:
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id format.",
        )

    db = get_database()
    document = {
        "user_id": user_id,
        "goal": goal,
        "dna_profile": dna_profile,
        "roadmap": roadmap.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.roadmaps.insert_one(document)
    return {
        "id": str(result.inserted_id),
        "user_id": document["user_id"],
        "goal": document["goal"],
        "roadmap": document["roadmap"],
        "created_at": document["created_at"],
    }


async def get_latest_roadmap_for_user(user_id: str) -> dict | None:
    db = get_database()
    document = await db.roadmaps.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)],
    )
    if not document:
        return None
    return {
        "id": str(document["_id"]),
        "user_id": document["user_id"],
        "goal": document["goal"],
        "roadmap": document["roadmap"],
        "created_at": document["created_at"],
    }
