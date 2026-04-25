import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient

# Add the parent directory to sys.path to allow absolute imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

async def seed_mentors():
    # Use environment variable or default
    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    mongodb_db_name = os.getenv("MONGODB_DB_NAME", "myedudna")
    
    client = AsyncIOMotorClient(mongodb_uri)
    db = client[mongodb_db_name]
    
    mentors = [
      {
        "name": "Rahul Sharma",
        "domain": "AI / Machine Learning",
        "email": "adulavivekgoud@gmail.com",
        "skills": ["Python", "Deep Learning", "Neural Networks"],
        "experience": "5 years",
        "interests": ["ai", "ml", "deep learning"],
        "strengths": ["analytical", "practical"],
        "tags": ["analytical", "practical", "visual"]
      },
      {
        "name": "Priya Reddy",
        "domain": "Web Development",
        "email": "adulavivekgoud@gmail.com",
        "skills": ["React", "Node.js", "Frontend"],
        "experience": "4 years",
        "interests": ["web", "frontend", "design"],
        "strengths": ["creative", "visual"],
        "tags": ["creative", "visual", "practical"]
      },
      {
        "name": "Arjun Mehta",
        "domain": "Data Science",
        "email": "adulavivekgoud@gmail.com",
        "skills": ["Python", "Pandas", "ML"],
        "experience": "6 years",
        "interests": ["data science", "statistics", "python"],
        "strengths": ["analytical"],
        "tags": ["analytical", "logical"]
      },
      {
        "name": "Sneha Iyer",
        "domain": "Cybersecurity",
        "email": "adulavivekgoud@gmail.com",
        "skills": ["Networking", "Security", "Ethical Hacking"],
        "experience": "7 years",
        "interests": ["security", "networking", "cyber"],
        "strengths": ["logical"],
        "tags": ["logical", "analytical"]
      },
      {
        "name": "David Miller",
        "domain": "Mobile Development",
        "email": "adulavivekgoud@gmail.com",
        "skills": ["Flutter", "Dart", "Firebase"],
        "experience": "3 years",
        "interests": ["mobile", "apps", "ui"],
        "strengths": ["visual", "creative"],
        "tags": ["visual", "creative"]
      },
      {
        "name": "Elena Petrova",
        "domain": "UI/UX Design",
        "email": "adulavivekgoud@gmail.com",
        "skills": ["Figma", "Adobe XD", "User Research"],
        "experience": "8 years",
        "interests": ["design", "experience", "research"],
        "strengths": ["creative", "empathy"],
        "tags": ["creative", "visual"]
      }
    ]

    # Clear existing mentors to avoid duplicates in this demo
    await db.mentors.delete_many({})
    
    # Insert mentors
    result = await db.mentors.insert_many(mentors)
    print(f"Successfully seeded {len(result.inserted_ids)} mentors.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_mentors())
