from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
    mongodb_uri: str = (os.getenv("MONGODB_URI") or "mongodb://localhost:27017").strip().replace('"', '').replace("'", "")
    mongodb_db_name: str = os.getenv("MONGODB_DB_NAME", "myedudna")
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "change-this-secret")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expire_minutes: int = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    supervity_agent_url: str = os.getenv(
        "SUPERVITY_AGENT_URL", "https://api.supervity.ai/v1/agent/run"
    )
    supervity_api_key: str = os.getenv("SUPERVITY_API_KEY", "")
    email_user: str = os.getenv("EMAIL_USER", "")
    email_pass: str = os.getenv("EMAIL_PASS", "")


settings = Settings()
