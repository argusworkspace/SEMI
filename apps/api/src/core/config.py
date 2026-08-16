from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    cors_origins: list[str] = ["http://localhost:3000"]

    # Cashfree (kept but bypassed until gateway is approved)
    cashfree_app_id: str = ""
    cashfree_secret_key: str = ""
    cashfree_env: str = "sandbox"  # "sandbox" | "production"

    # OCR.space free API — get key at https://ocr.space/ocrapi (25k req/month free)
    ocr_space_api_key: str = "helloworld"  # "helloworld" is the public demo key (rate-limited)

    # Manual payment UPI details shown to customer
    payment_upi_id: str = "semy@ybl"
    payment_upi_name: str = "SEMY Mobility"

    @property
    def cashfree_base_url(self) -> str:
        if self.cashfree_env == "production":
            return "https://api.cashfree.com/pg"
        return "https://sandbox.cashfree.com/pg"


settings = Settings()  # type: ignore[call-arg]
