"""Application Settings - Environment configuration."""

from functools import lru_cache
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Configurações da aplicação carregadas de variáveis de ambiente.
    
    Usa pydantic-settings para validação e tipagem.
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
    
    # Application
    app_env: str = Field(default="development", alias="APP_ENV")
    debug: bool = Field(default=True, alias="DEBUG")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    base_url: str = Field(default="http://localhost:8000", alias="BASE_URL")
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    
    # OpenAI
    openai_api_key: Optional[str] = Field(default=None, alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o", alias="OPENAI_MODEL")
    
    # Perplexity
    perplexity_api_key: Optional[str] = Field(default=None, alias="PERPLEXITY_API_KEY")
    
    # Anthropic
    anthropic_api_key: Optional[str] = Field(default=None, alias="ANTHROPIC_API_KEY")
    
    # Vector Store
    vector_store_provider: str = Field(default="qdrant", alias="VECTOR_STORE_PROVIDER")
    qdrant_url: str = Field(default="http://localhost:6333", alias="QDRANT_URL")
    qdrant_api_key: Optional[str] = Field(default=None, alias="QDRANT_API_KEY")
    qdrant_collection_name: str = Field(default="coomb_knowledge", alias="QDRANT_COLLECTION_NAME")
    
    # Storage
    storage_provider: str = Field(default="local", alias="STORAGE_PROVIDER")
    local_storage_path: str = Field(default="./storage", alias="LOCAL_STORAGE_PATH")
    s3_bucket: Optional[str] = Field(default=None, alias="S3_BUCKET")
    s3_access_key: Optional[str] = Field(default=None, alias="S3_ACCESS_KEY")
    s3_secret_key: Optional[str] = Field(default=None, alias="S3_SECRET_KEY")
    s3_region: str = Field(default="us-east-1", alias="S3_REGION")
    
    # Cache
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    
    # Security
    api_secret_key: str = Field(default="change-me-in-production", alias="API_SECRET_KEY")
    cors_origins: str = Field(
        default="http://localhost:3000,http://localhost:3001",
        alias="CORS_ORIGINS"
    )
    
    # External Services
    coomb_api_url: str = Field(default="http://localhost:3001", alias="COOMB_API_URL")
    
    @property
    def is_production(self) -> bool:
        """Verifica se está em produção."""
        return self.app_env == "production"
    
    @property
    def is_development(self) -> bool:
        """Verifica se está em desenvolvimento."""
        return self.app_env == "development"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Retorna lista de origens CORS."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    def get_llm_provider_name(self) -> str:
        """Determina qual LLM provider usar baseado nas configs."""
        if self.openai_api_key:
            return "openai"
        if self.perplexity_api_key:
            return "perplexity"
        if self.anthropic_api_key:
            return "anthropic"
        return "openai"  # default


@lru_cache
def get_settings() -> Settings:
    """
    Factory function para obter settings (singleton).
    
    Returns:
        Settings configurado
    """
    return Settings()

