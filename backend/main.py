import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.mongodb import close_mongo_connection, connect_to_mongo
from app.routes.auth import router as auth_router
from app.routes.course import router as course_router
from app.routes.dna import router as dna_router
from app.routes.labs import router as labs_router
from app.routes.mentors import router as mentors_router
from app.routes.roadmap import router as roadmap_router
from app.routes.youtube import router as youtube_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title="MyEduDNA Backend", lifespan=lifespan)
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Standard Vite port
    os.getenv("FRONTEND_URL", "https://myedudna.vercel.app/"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(dna_router)
app.include_router(roadmap_router)
app.include_router(course_router)
app.include_router(mentors_router)
app.include_router(labs_router)
app.include_router(youtube_router)


@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok"}
