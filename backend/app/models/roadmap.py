from pydantic import BaseModel, Field


class RoadmapPhase(BaseModel):
    title: str
    modules: list[str]


class RoadmapResult(BaseModel):
    phases: list[RoadmapPhase]


class RoadmapGenerateRequest(BaseModel):
    goal: str = Field(..., min_length=2, max_length=200)
    dna_profile: dict | None = None


class RoadmapGenerateResponse(BaseModel):
    goal: str
    roadmap: RoadmapResult
