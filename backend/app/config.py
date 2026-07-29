import os
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "PramaanAI API"
    VERSION: str = "1.0.0"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-pramaan-ai-security-hash-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # MongoDB Atlas Settings
    MONGODB_URL: str = os.getenv(
        "MONGODB_URL", 
        "mongodb+srv://anshiag7206_db_user:KVR52VnMvveiqf0s@pramaan.mmeciht.mongodb.net/pramaan_db?retryWrites=true&w=majority&appName=Pramaan"
    )
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "pramaan_db")
    
    # AI & Phone API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    PHONE_VALIDATOR_API_KEY: str = os.getenv("PHONE_VALIDATOR_API_KEY", "apv_ac67d71f-a18b-455a-87b6-ac2a0159f620")

    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
