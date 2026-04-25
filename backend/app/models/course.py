from pydantic import BaseModel, Field


class CourseLesson(BaseModel):
    type: str
    content: str | None = None
    questions: list[dict] | None = None


class CourseContent(BaseModel):
    title: str
    lessons: list[CourseLesson]


class CourseGenerateRequest(BaseModel):
    module_name: str = Field(..., min_length=2, max_length=200)
    roadmap_id: str


class CourseCompleteRequest(BaseModel):
    course_id: str | None = None
    module_name: str | None = Field(default=None, min_length=2, max_length=200)
    roadmap_id: str | None = None
