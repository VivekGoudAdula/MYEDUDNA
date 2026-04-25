from pydantic import BaseModel, Field


class DNAQuestion(BaseModel):
    question: str
    options: list[str]
    category: str


class DNAQuestionsResponse(BaseModel):
    level: str
    questions: list[DNAQuestion]


class DNASubmitRequest(BaseModel):
    answers: list[str] = Field(..., min_length=5, max_length=5)
    time_taken: list[float] = Field(..., min_length=5, max_length=5)
    level: str


class DNAProfile(BaseModel):
    learningStyle: str
    strengths: list[str]
    weaknesses: list[str]
    level: str


class DNASubmitResponse(BaseModel):
    level: str
    accuracy: float
    avg_time_per_question: float
    profile: DNAProfile
