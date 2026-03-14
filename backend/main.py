from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import sqlite3
from dotenv import load_dotenv
from groq import Groq

load_dotenv("../.env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database
DB_FILE = "myedudna.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT,
            career_goal TEXT,
            learning_style TEXT,
            skill_level TEXT,
            interests TEXT,
            weekly_commitment TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roadmaps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            career TEXT,
            roadmap_json TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            module_id TEXT,
            completion_status TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Use GROQ API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

class OnboardingRequest(BaseModel):
    user_id: str
    career_goal: str
    skill_level: str
    learning_style: str
    interests: str
    weekly_commitment: str

@app.post("/onboarding")
async def generate_onboarding_roadmap(req: OnboardingRequest):
    # 1. Check if roadmap already exists to satisfy "must not be generated always"
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT roadmap_json FROM roadmaps WHERE user_id = ?', (req.user_id,))
        existing = cursor.fetchone()
        conn.close()
        if existing:
            return json.loads(existing[0])
    except Exception as e:
        print("Error checking existing roadmap:", e)

    if not groq_client:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    
    prompt = f"""You are an AI career learning architect.

Student profile:
Career goal: {req.career_goal}
Skill level: {req.skill_level}
Learning style: {req.learning_style}
Interests: {req.interests}
Weekly commitment: {req.weekly_commitment}

Generate a detailed learning roadmap.

Output STRICTLY in JSON format with no markdown wrappers or extra text:
{{
  "modules": [
    {{
      "title": "Module Title",
      "description": "Short description",
      "skills_learned": ["Skill 1", "Skill 2"],
      "technologies_used": ["Tech 1", "Tech 2"],
      "difficulty_level": "Beginner/Intermediate/Advanced",
      "estimated_duration": "In weeks based on {req.weekly_commitment} commitment"
    }}
  ]
}}

The roadmap should progress from beginner to advanced based on their current skill level, containing exactly 5 modules.
"""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        result_content = response.choices[0].message.content
        try:
            roadmap_json = json.loads(result_content)
        except Exception:
            # Fallback if somehow it's still broken
            roadmap_json = {"modules": []}

        # Save to SQLite
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            
            # Upsert user (SQLite style insert or replace)
            cursor.execute('''
                INSERT INTO users (id, career_goal, learning_style, skill_level, interests, weekly_commitment)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    career_goal=excluded.career_goal,
                    learning_style=excluded.learning_style,
                    skill_level=excluded.skill_level,
                    interests=excluded.interests,
                    weekly_commitment=excluded.weekly_commitment
            ''', (req.user_id, req.career_goal, req.learning_style, req.skill_level, req.interests, req.weekly_commitment))

            # Delete old roadmap if exists and insert new one
            cursor.execute('DELETE FROM roadmaps WHERE user_id = ?', (req.user_id,))
            cursor.execute('''
                INSERT INTO roadmaps (user_id, career, roadmap_json)
                VALUES (?, ?, ?)
            ''', (req.user_id, req.career_goal, json.dumps(roadmap_json)))
            
            conn.commit()
            conn.close()
        except Exception as db_e:
            print("Database error:", str(db_e))
            # Continue even if DB fails to return roadmap
        
        return roadmap_json
    except Exception as e:
        print("Error generation roadmap:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/roadmap/{user_id}")
async def get_roadmap(user_id: str):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT roadmap_json FROM roadmaps WHERE user_id = ?', (user_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail="Roadmap not found")
            
        return json.loads(row[0])
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))
