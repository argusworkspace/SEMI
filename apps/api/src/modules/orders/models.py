import enum
import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.modules.shared.base_model import BaseModel


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    AWAITING_PAYMENT = "AWAITING_PAYMENT"
    UNDER_REVIEW = "UNDER_REVIEW"    # proof uploaded, pending admin verification
    ADVANCE_PAID = "ADVANCE_PAID"    # admin confirmed payment
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"


class PaymentStatus(str, enum.Enum):
    CREATED = "CREATED"
    UNDER_REVIEW = "UNDER_REVIEW"    # screenshot uploaded, OCR ran, awaiting admin
    PAID = "PAID"                    # confirmed (Cashfree webhook or admin action)
    FAILED = "FAILED"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"
    USER_DROPPED = "USER_DROPPED"


ADVANCE_AMOUNT = Decimal("5000.00")


class Order(BaseModel):
    __tablename__ = "orders"

    idempotency_key: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    order_number: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)

    product_id: Mapped[str] = mapped_column(String(64), nullable=False)
    product_name: Mapped[str] = mapped_column(String(256), nullable=False)
    color: Mapped[str | None] = mapped_column(String(64))

    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    advance_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=ADVANCE_AMOUNT
    )

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

    # Cashfree fields (kept but bypassed until gateway is active)
    cashfree_order_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    cashfree_payment_id: Mapped[str | None] = mapped_column(String(128))
    payment_session_id: Mapped[str | None] = mapped_column(Text)

    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False, default="INR")
    status: Mapped[PaymentStatus] = mapped_column(
        String(32), nullable=False, default=PaymentStatus.CREATED
    )

    payment_method: Mapped[str | None] = mapped_column(String(64))
    webhook_verified: Mapped[bool] = mapped_column(default=False, nullable=False)
    raw_webhook: Mapped[str | None] = mapped_column(Text)

    # Manual payment proof (screenshot OCR flow)
    screenshot_b64: Mapped[str | None] = mapped_column(Text)
    ocr_text: Mapped[str | None] = mapped_column(Text)
    ocr_amount_detected: Mapped[bool] = mapped_column(default=False, nullable=False)
    upi_ref: Mapped[str | None] = mapped_column(String(100))       # UTR / transaction ID
    upi_to: Mapped[str | None] = mapped_column(String(200))        # recipient from OCR
    upi_from: Mapped[str | None] = mapped_column(String(200))      # sender from OCR
    upi_date: Mapped[str | None] = mapped_column(String(50))       # date string from OCR
    upi_time: Mapped[str | None] = mapped_column(String(50))       # time string from OCR
