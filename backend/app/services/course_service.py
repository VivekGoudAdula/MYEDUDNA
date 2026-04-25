import json
from datetime import datetime, timezone

import httpx
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError
from pymongo import ReturnDocument

from app.db.mongodb import get_database
from app.models.course import CourseContent
from app.utils.config import settings

SUPERVITY_WORKFLOW_ID = "019dbe63-40ab-7000-a963-215cb3ca4632"
SUPERVITY_SOURCE_HEADER = "v1"


async def get_roadmap_by_id(roadmap_id: str) -> dict:
    if not ObjectId.is_valid(roadmap_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid roadmap_id format.",
        )

    db = get_database()
    roadmap = await db.roadmaps.find_one({"_id": ObjectId(roadmap_id)})
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found.",
        )
    return roadmap


def get_roadmap_modules(roadmap: dict) -> list[str]:
    phases = roadmap.get("roadmap", {}).get("phases", [])
    modules: list[str] = []
    for phase in phases:
        modules.extend(phase.get("modules", []))
    return modules


async def generate_with_supervity(module_name: str, roadmap: dict) -> dict:
    if not settings.supervity_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPERVITY_API_KEY is not configured.",
        )

    dna_profile = roadmap.get("dna_profile", {})
    user_goal = roadmap.get("goal", "")
    user_level = (
        dna_profile.get("level")
        or dna_profile.get("profile", {}).get("level")
        or "intermediate"
    )
    learning_style = (
        dna_profile.get("learningStyle")
        or dna_profile.get("profile", {}).get("learningStyle")
        or "analytical"
    )
    strengths = dna_profile.get("strengths") or dna_profile.get("profile", {}).get(
        "strengths", []
    )
    weaknesses = dna_profile.get("weaknesses") or dna_profile.get("profile", {}).get(
        "weaknesses", []
    )

    headers = {
        "Authorization": f"Bearer {settings.supervity_api_key}",
        "x-source": SUPERVITY_SOURCE_HEADER,
    }
    multipart_fields = [
        ("workflowId", (None, SUPERVITY_WORKFLOW_ID)),
        ("inputs[module_name]", (None, module_name)),
        ("inputs[user_goal]", (None, str(user_goal))),
        ("inputs[user_level]", (None, str(user_level))),
        ("inputs[learning_style]", (None, str(learning_style))),
        ("inputs[strengths]", (None, ", ".join(strengths) if isinstance(strengths, list) else str(strengths))),
        ("inputs[weaknesses]", (None, ", ".join(weaknesses) if isinstance(weaknesses, list) else str(weaknesses))),
    ]

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            settings.supervity_agent_url,
            files=multipart_fields,
            headers=headers,
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supervity agent request failed.",
        )

    body = _parse_supervity_response(response.text)

    if "title" in body and "lessons" in body:
        return body
    if "data" in body and isinstance(body["data"], dict):
        return body["data"]

    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail="Supervity response missing expected course fields.",
    )


def _parse_supervity_response(raw_response: str) -> dict:
    try:
        parsed = json.loads(raw_response)
        if isinstance(parsed, dict):
            return _extract_course_payload(parsed)
    except json.JSONDecodeError:
        pass

    last_event_payload: dict | None = None
    for line in raw_response.splitlines():
        cleaned = line.strip()
        if not cleaned.startswith("data:"):
            continue
        data_str = cleaned[5:].strip()
        if not data_str or data_str == "[DONE]":
            continue
        try:
            parsed_event = json.loads(data_str)
        except json.JSONDecodeError:
            continue
        if isinstance(parsed_event, dict):
            last_event_payload = parsed_event

    if last_event_payload is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supervity returned non-JSON streaming response.",
        )
    return _extract_course_payload(last_event_payload)


def _extract_course_payload(payload: dict) -> dict:
    if "title" in payload and "lessons" in payload:
        return payload

    candidates = [
        payload.get("data"),
        payload.get("output"),
        payload.get("result"),
        payload.get("response"),
    ]
    for candidate in candidates:
        if isinstance(candidate, dict):
            if "title" in candidate and "lessons" in candidate:
                return candidate
            inner = candidate.get("output")
            if isinstance(inner, dict) and "title" in inner and "lessons" in inner:
                return inner

    return payload


async def refine_course_with_groq(course_payload: dict) -> CourseContent:
    if not settings.groq_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GROQ_API_KEY is not configured.",
        )

    prompt = (
        "You are an expert instructional designer.\n\n"
        "Refine and structure this course to be VERY detailed and lengthy.\n"
        "Requirements:\n"
        "- Output 6 to 10 lessons.\n"
        "- Lessons should be rich, practical, and explain concepts clearly.\n"
        "- Include a mix of types: video, reading, and quiz.\n"
        "- For reading lessons, content must be long (multiple paragraphs, bullet points, examples).\n"
        "- For quiz lessons, include 5-10 questions with options and correct answer.\n\n"
        "Return only JSON with this exact shape:\n"
        "{\n"
        '  "title": "string",\n'
        '  "lessons": [\n'
        "    {\n"
        '      "type": "video | reading | quiz",\n'
        '      "content": "string or null",\n'
        '      "questions": []\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Course draft:\n"
        f"{json.dumps(course_payload, ensure_ascii=True)}"
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

    async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers=headers,
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Groq request failed while refining course.",
        )

    content = response.json()["choices"][0]["message"]["content"]
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Groq returned non-JSON course response.",
        ) from exc

    try:
        return CourseContent(**parsed)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Groq response JSON is missing expected course keys.",
        ) from exc


async def store_course(
    module_name: str, roadmap_id: str, course: CourseContent, source_raw: dict
) -> dict:
    db = get_database()
    roadmap = await get_roadmap_by_id(roadmap_id)
    user_id = roadmap.get("user_id")
    if not isinstance(user_id, str) or not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Roadmap is missing relation user_id.",
        )

    document = {
        "user_id": user_id,
        "module_name": module_name,
        "roadmap_id": roadmap_id,
        "course": course.model_dump(),
        "source_raw": source_raw,
        "is_completed": False,
        "completed_at": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        result = await db.courses.insert_one(document)
    except DuplicateKeyError:
        existing = await db.courses.find_one(
            {"user_id": user_id, "roadmap_id": roadmap_id, "module_name": module_name}
        )
        if not existing:
            raise
        return {
            "id": str(existing["_id"]),
            "user_id": existing["user_id"],
            "module_name": existing["module_name"],
            "roadmap_id": existing["roadmap_id"],
            "course": existing["course"],
            "is_completed": bool(existing.get("is_completed", False)),
            "completed_at": existing.get("completed_at"),
            "created_at": existing["created_at"],
        }
    return {
        "id": str(result.inserted_id),
        "user_id": document["user_id"],
        "module_name": document["module_name"],
        "roadmap_id": document["roadmap_id"],
        "course": document["course"],
        "is_completed": document["is_completed"],
        "completed_at": document["completed_at"],
        "created_at": document["created_at"],
    }


async def get_course_by_roadmap_and_module(roadmap_id: str, module_name: str) -> dict | None:
    db = get_database()
    course = await db.courses.find_one(
        {"roadmap_id": roadmap_id, "module_name": module_name}
    )
    if not course:
        return None
    return {
        "id": str(course["_id"]),
        "user_id": course["user_id"],
        "module_name": course["module_name"],
        "roadmap_id": course["roadmap_id"],
        "course": course["course"],
        "is_completed": bool(course.get("is_completed", False)),
        "completed_at": course.get("completed_at"),
        "created_at": course["created_at"],
    }


async def ensure_course_for_module(roadmap_id: str, module_name: str, roadmap: dict) -> dict:
    existing = await get_course_by_roadmap_and_module(roadmap_id, module_name)
    if existing is not None:
        return existing

    try:
        source_payload = await generate_with_supervity(module_name, roadmap)
    except HTTPException:
        source_payload = _build_local_course_payload(module_name, roadmap)

    try:
        refined_course = await refine_course_with_groq(source_payload)
    except HTTPException:
        refined_course = _coerce_course_content(source_payload, module_name)

    return await store_course(
        module_name=module_name,
        roadmap_id=roadmap_id,
        course=refined_course,
        source_raw=source_payload,
    )


def get_first_module_from_roadmap(roadmap: dict) -> str | None:
    phases = roadmap.get("roadmap", {}).get("phases", [])
    for phase in phases:
        modules = phase.get("modules", [])
        if isinstance(modules, list) and modules:
            first = modules[0]
            if isinstance(first, str) and first.strip():
                return first
    return None


def _build_local_course_payload(module_name: str, roadmap: dict) -> dict:
    goal = roadmap.get("goal", "your target role")
    return {
        "title": f"{module_name} Fundamentals",
        "lessons": [
            {
                "type": "video",
                "content": (
                    f"Deep overview of {module_name} and how it connects to {goal}.\n\n"
                    "In this lesson you'll learn:\n"
                    "- What the topic is\n"
                    "- Why it matters\n"
                    "- Where it's used in real projects\n"
                    "- How you will be assessed\n"
                ),
                "questions": [],
            },
            {
                "type": "reading",
                "content": (
                    f"Core concepts for {module_name}\n\n"
                    "1) Foundations\n"
                    "- Definitions, terminology, and mental models.\n"
                    "- Common pitfalls and misconceptions.\n\n"
                    "2) Practical Workflow\n"
                    "- Step-by-step process used in industry.\n"
                    "- Tooling checklist and setup.\n\n"
                    "3) Hands-on Example\n"
                    "- Walk through a realistic example with explanation.\n\n"
                    "4) Mini Exercises\n"
                    "- 3 short tasks you can do immediately.\n"
                ),
                "questions": [],
            },
            {
                "type": "reading",
                "content": (
                    "Patterns & best practices\n\n"
                    "- Design patterns you should know\n"
                    "- Performance considerations\n"
                    "- Debugging and testing tips\n"
                    "- How to explain this in interviews\n"
                ),
                "questions": [],
            },
            {
                "type": "reading",
                "content": (
                    "Project: Build something small\n\n"
                    "Goal: Apply the concepts in a mini-project.\n\n"
                    "Deliverables:\n"
                    "- Working implementation\n"
                    "- Short writeup: what you learned\n"
                    "- Edge cases you handled\n"
                ),
                "questions": [],
            },
            {
                "type": "quiz",
                "content": None,
                "questions": [
                    {
                        "question": f"What is the main outcome of learning {module_name}?",
                        "options": [
                            "Understanding foundations and practical usage",
                            "Only memorizing theory",
                            "Skipping implementation",
                            "Avoiding projects",
                        ],
                        "answer": "Understanding foundations and practical usage",
                    }
                ],
            },
            {
                "type": "quiz",
                "content": None,
                "questions": [
                    {
                        "question": "Which approach is best for long-term mastery?",
                        "options": [
                            "Practice + feedback loops",
                            "Only watching videos",
                            "Only reading without building",
                            "Skipping fundamentals",
                        ],
                        "answer": "Practice + feedback loops",
                    }
                ],
            },
        ],
    }


def _coerce_course_content(payload: dict, module_name: str) -> CourseContent:
    title = payload.get("title")
    if not isinstance(title, str) or not title.strip():
        title = f"{module_name} Course"

    raw_lessons = payload.get("lessons")
    normalized_lessons: list[dict] = []
    if isinstance(raw_lessons, list):
        for lesson in raw_lessons:
            if not isinstance(lesson, dict):
                continue
            lesson_type = lesson.get("type")
            if not isinstance(lesson_type, str) or not lesson_type.strip():
                lesson_type = "reading"
            content = lesson.get("content")
            if content is not None and not isinstance(content, str):
                content = str(content)
            questions = lesson.get("questions")
            if not isinstance(questions, list):
                questions = []
            normalized_lessons.append(
                {
                    "type": lesson_type,
                    "content": content,
                    "questions": questions,
                }
            )

    if not normalized_lessons:
        normalized_lessons = _build_local_course_payload(module_name, {}).get("lessons", [])

    return CourseContent(
        title=title,
        lessons=normalized_lessons,
    )


async def list_courses_for_user(user_id: str) -> list[dict]:
    db = get_database()
    cursor = db.courses.find({"user_id": user_id}, sort=[("created_at", -1)])
    rows = await cursor.to_list(length=100)
    return [
        {
            "id": str(row["_id"]),
            "user_id": row["user_id"],
            "module_name": row["module_name"],
            "roadmap_id": row["roadmap_id"],
            "course": row["course"],
            "is_completed": bool(row.get("is_completed", False)),
            "completed_at": row.get("completed_at"),
            "created_at": row["created_at"],
        }
        for row in rows
    ]


async def mark_course_completed(
    user_id: str, course_id: str | None, module_name: str | None, roadmap_id: str | None
) -> dict:
    db = get_database()
    query: dict = {"user_id": user_id}
    if course_id:
        if not ObjectId.is_valid(course_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid course_id format.",
            )
        query["_id"] = ObjectId(course_id)
    elif module_name and roadmap_id:
        query["module_name"] = module_name
        query["roadmap_id"] = roadmap_id
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide course_id or both module_name and roadmap_id.",
        )

    completed_at = datetime.now(timezone.utc).isoformat()
    result = await db.courses.find_one_and_update(
        query,
        {
            "$set": {
                "is_completed": True,
                "completed_at": completed_at,
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found for this user.",
        )
    return {
        "id": str(result["_id"]),
        "user_id": result["user_id"],
        "module_name": result["module_name"],
        "roadmap_id": result["roadmap_id"],
        "course": result["course"],
        "is_completed": bool(result.get("is_completed", False)),
        "completed_at": result.get("completed_at"),
        "created_at": result["created_at"],
    }
