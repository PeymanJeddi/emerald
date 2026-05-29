from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://esc:esc_secret@localhost:5432/emerald_scholars"
    jwt_secret: str = "dev-secret-change-me"
    jwt_expires_in: int = 86400
    cors_origins: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002"
    upload_dir: str = "./uploads"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
