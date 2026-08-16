import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field

from .models import OrderStatus, PaymentStatus


class OrderCreate(BaseModel):
    idempotency_key: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Client-generated unique key. Resending the same key returns the existing order.",
    )
    product_id: str
    product_name: str
    color: str | None = None
    unit_price: Decimal = Field(..., gt=0)

    customer_name: str = Field(..., min_length=2)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=10, max_length=15)
    delivery_pincode: str | None = None
    notes: str | None = None


class PaymentRead(BaseModel):
    id: uuid.UUID
    cashfree_order_id: str
    amount: Decimal
    currency: str
    status: PaymentStatus
    payment_session_id: str | None

    model_config = {"from_attributes": True}


class OrderRead(BaseModel):
    id: uuid.UUID
    order_number: str
    idempotency_key: str
    product_id: str
    product_name: str
    color: str | None
    unit_price: Decimal
    advance_amount: Decimal
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_pincode: str | None
    status: OrderStatus
    created_at: datetime
    active_payment: PaymentRead | None = None

    model_config = {"from_attributes": True}


class WebhookPayload(BaseModel):
    """Cashfree v3 webhook event shape (top-level fields we care about)."""
    type: str
    data: dict
