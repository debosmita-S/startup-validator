from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    gemini_api_key: str = ""
    mongodb_uri: str = "mongodb://localhost:27017"
    database_name: str = "startup_validator"
    jwt_secret: str = "dev_fallback_jwt_secret_change_me_in_production"

    class Config:
        env_file = ".env"


settings = Settings()
