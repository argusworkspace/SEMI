import enum
import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.modules.shared.base_model import BaseModel


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"          # order created, payment not yet initiated
    AWAITING_PAYMENT = "AWAITING_PAYMENT"  # payment session handed to customer
    ADVANCE_PAID = "ADVANCE_PAID"  # ₹5,000 advance confirmed
    CONFIRMED = "CONFIRMED"      # operator confirmed the booking
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"


class PaymentStatus(str, enum.Enum):
    CREATED = "CREATED"          # Cashfree order created, waiting for customer
    PAID = "PAID"                # payment successful (webhook confirmed)
    FAILED = "FAILED"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"
    USER_DROPPED = "USER_DROPPED"


ADVANCE_AMOUNT = Decimal("5000.00")


class Order(BaseModel):
    __tablename__ = "orders"

    # Idempotency: client supplies a unique key per checkout attempt.
    # Duplicate submissions return the existing order instead of creating another.
    idempotency_key: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)

    order_number: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)

    # Product info (no products table yet — stored as flat fields)
    product_id: Mapped[str] = mapped_column(String(64), nullable=False)
    product_name: Mapped[str] = mapped_column(String(256), nullable=False)
    color: Mapped[str | None] = mapped_column(String(64))

    # Pricing
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    advance_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=ADVANCE_AMOUNT
    )

    # Customer details (captured at order time; user account is optional)
    customer_name: Mapped[str] = mapped_column(String(256), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(256), nullable=False, index=True)
    customer_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    delivery_pincode: Mapped[str | None] = mapped_column(String(10))
    notes: Mapped[str | None] = mapped_column(Text)

    status: Mapped[OrderStatus] = mapped_column(
        String(32), nullable=False, default=OrderStatus.PENDING
    )

    payments: Mapped[list["Payment"]] = relationship(
        "Payment", back_populates="order", cascade="all, delete-orphan"
    )


class Payment(BaseModel):
    __tablename__ = "payments"

    order_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    order: Mapped[Order] = relationship("Order", back_populates="payments")

    # The order_id we send to Cashfree — also our per-attempt idempotency key at CF level.
    # Format: cf-{payment.id}. Cashfree deduplicates on this value.
    cashfree_order_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)

    # Filled by Cashfree webhook once payment completes
    cashfree_payment_id: Mapped[str | None] = mapped_column(String(128))

    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False, default="INR")

    status: Mapped[PaymentStatus] = mapped_column(
        String(32), nullable=False, default=PaymentStatus.CREATED
    )

    # Opaque session token returned by Cashfree — frontend passes this to their JS SDK
    payment_session_id: Mapped[str | None] = mapped_column(Text)

    payment_method: Mapped[str | None] = mapped_column(String(64))  # upi / card / netbanking …
    webhook_verified: Mapped[bool] = mapped_column(default=False, nullable=False)
    raw_webhook: Mapped[str | None] = mapped_column(Text)  # raw JSON blob for audit trail
