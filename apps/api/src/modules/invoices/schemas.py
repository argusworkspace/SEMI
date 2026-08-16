import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class BuyerCreate(BaseModel):
    order_id: uuid.UUID
    name: str = Field(..., min_length=2, max_length=256)
    address: str = Field(..., min_length=5)
    district: str = Field(..., min_length=2, max_length=100)
    pin: str = Field(..., pattern=r"^\d{6}$", description="6-digit PIN code")
    state: str = Field(..., min_length=2, max_length=100)
    gstin: str | None = Field(
        default=None,
        pattern=r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
        description="15-character GSTIN (optional)",
    )


class TaxInvoiceRead(BaseModel):
    id: uuid.UUID
    invoice_number: str
    created_at: datetime
    status: str

    # Buyer
    buyer_name: str
    buyer_address: str
    buyer_district: str
    buyer_pin: str
    buyer_state: str
    buyer_gstin: str | None

    # Order
    order_number: str
    product_id: str
    product_name: str
    color: str | None
    unit_price: Decimal
    advance_amount: Decimal
    balance_amount: Decimal

    # Customer
    customer_name: str
    customer_email: str
    customer_phone: str

    # Payment / OCR
    upi_transaction_id: str | None
    upi_to: str | None
    upi_from: str | None
    upi_amount: Decimal | None
    upi_date: str | None
    upi_time: str | None
    payment_status: str

    # Seller
    seller_name: str
    seller_upi_id: str | None

    model_config = {"from_attributes": True}
