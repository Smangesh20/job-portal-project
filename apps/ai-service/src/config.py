"""
Configuration settings for AI Service
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    JWT_SECRET: str = "your-jwt-secret-here"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # Database
    DATABASE_URL: str = "postgresql://askyacham_user:secure_password_2024@localhost:5432/askyacham"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    
    # AI Services
    OPENAI_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    
    # Model Configuration
    MODEL_CACHE_DIR: str = "./models"
    MAX_SEQUENCE_LENGTH: int = 512
    BATCH_SIZE: int = 32
    
    # Matching Configuration
    MATCHING_WEIGHTS: dict = {
        "skills": 0.3,
        "experience": 0.25,
        "cultural_fit": 0.2,
        "location": 0.15,
        "salary": 0.1
    }
    
    DEFAULT_MATCH_LIMIT: int = 50
    MIN_MATCH_SCORE: float = 0.3
    
    # NLP Configuration
    SPACY_MODEL: str = "en_core_web_sm"
    SENTIMENT_MODEL: str = "vader"
    
    # Analytics Configuration
    ANALYTICS_RETENTION_DAYS: int = 365
    BATCH_PROCESSING_SIZE: int = 1000
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 3600  # seconds
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    
    # Feature Flags
    ENABLE_REAL_TIME_MATCHING: bool = True
    ENABLE_BATCH_MATCHING: bool = True
    ENABLE_ANALYTICS: bool = True
    ENABLE_NLP_PROCESSING: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


# Model paths
MODEL_PATHS = {
    "skill_matcher": os.path.join(settings.MODEL_CACHE_DIR, "skill_matcher.pkl"),
    "cultural_fit": os.path.join(settings.MODEL_CACHE_DIR, "cultural_fit.pkl"),
    "salary_predictor": os.path.join(settings.MODEL_CACHE_DIR, "salary_predictor.pkl"),
    "job_classifier": os.path.join(settings.MODEL_CACHE_DIR, "job_classifier.pkl"),
    "resume_parser": os.path.join(settings.MODEL_CACHE_DIR, "resume_parser.pkl"),
    "sentiment_analyzer": os.path.join(settings.MODEL_CACHE_DIR, "sentiment_analyzer.pkl"),
}

# Create model directory if it doesn't exist
os.makedirs(settings.MODEL_CACHE_DIR, exist_ok=True)
