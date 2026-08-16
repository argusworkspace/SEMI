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
    payment_upi_id: str = "semy@indianbnk"
    payment_upi_name: str = "M S SEMY"

    # Seller / invoice details
    seller_legal_name: str = "M S SEMY"
    seller_trade_name: str = "SEMY Mobility"
    seller_address: str = ""
    seller_gstin: str = ""
    seller_state: str = "Tamil Nadu"
    seller_state_code: str = "33"
    seller_email: str = ""
    seller_bank_name: str = "Indian Bank"
    seller_bank_account: str = ""
    seller_bank_ifsc: str = ""

    # Product / GST
    product_hsn: str = "8712"
    gst_rate: float = 12.0   # total GST % (split equally as CGST + SGST)

    @property
    def cashfree_base_url(self) -> str:
        if self.cashfree_env == "production":
            return "https://api.cashfree.com/pg"
        return "https://sandbox.cashfree.com/pg"


settings = Settings()  # type: ignore[call-arg]
