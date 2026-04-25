from pydantic import BaseModel, Field


class LabSessionCreateRequest(BaseModel):
    experiment: str = Field(..., min_length=2, max_length=200)
    result: str = Field(..., min_length=1)
    score: int = Field(..., ge=0, le=100)
