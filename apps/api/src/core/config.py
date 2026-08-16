from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    cors_origins: list[str] = ["http://localhost:3000"]

    # Cashfree
    cashfree_app_id: str = ""
    cashfree_secret_key: str = ""
    cashfree_env: str = "sandbox"  # "sandbox" | "production"

    @property
    def cashfree_base_url(self) -> str:
        if self.cashfree_env == "production":
            return "https://api.cashfree.com/pg"
        return "https://sandbox.cashfree.com/pg"


settings = Settings()  # type: ignore[call-arg]
