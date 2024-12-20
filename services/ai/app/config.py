from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Sanara AI Service"
    
    # MongoDB Settings
    MONGODB_URL: str = "mongodb://sanara:sanara_dev@localhost:27017"
    MONGODB_DB: str = "sanara_ai"
    
    # OpenAI Settings
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    
    # Health Analysis Settings
    MIN_CONFIDENCE_SCORE: float = 0.7
    MAX_TOKENS: int = 1000
    TEMPERATURE: float = 0.3
    
    # NLP Settings
    SPACY_MODEL: str = "pt_core_news_lg"
    
    # Logging Settings
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings() 