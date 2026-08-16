import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.modules.shared.base_model import BaseModel


class Buyer(BaseModel):
    """Billing address collected at invoice time (may differ from shipping)."""

    __tablename__ = "buyers"

    order_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(256), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    pin: Mapped[str] = mapped_column(String(10), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    gstin: Mapped[str | None] = mapped_column(String(15))

    tax_invoice: Mapped["TaxInvoice | None"] = relationship(
        "TaxInvoice", back_populates="buyer", uselist=False
    )


class TaxInvoice(BaseModel):
    """
    Fully-denormalized invoice snapshot.
    Frontend queries ONLY this table — no joins required.
    """

    __tablename__ = "tax_invoices"

    invoice_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # FK references (kept for integrity; data is also copied below)
    order_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("orders.id", ondelete="RESTRICT"),
        unique=True,
        nullable=False,
        index=True,
    )
    buyer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("buyers.id", ondelete="RESTRICT"),
        nullable=False,
    )
    payment_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("payments.id", ondelete="SET NULL"),
    )

    buyer: Mapped[Buyer] = relationship("Buyer", back_populates="tax_invoice")

    # ── Buyer (denormalized) ───────────────────────────────────────────────────
    buyer_name: Mapped[str] = mapped_column(String(256), nullable=False)
    buyer_address: Mapped[str] = mapped_column(Text, nullable=False)
    buyer_district: Mapped[str] = mapped_column(String(100), nullable=False)
    buyer_pin: Mapped[str] = mapped_column(String(10), nullable=False)
    buyer_state: Mapped[str] = mapped_column(String(100), nullable=False)
    buyer_gstin: Mapped[str | None] = mapped_column(String(15))

    # ── Order (denormalized) ───────────────────────────────────────────────────
    order_number: Mapped[str] = mapped_column(String(32), nullable=False)
    product_id: Mapped[str] = mapped_column(String(64), nullable=False)
    product_name: Mapped[str] = mapped_column(String(256), nullable=False)
    color: Mapped[str | None] = mapped_column(String(64))
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    advance_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    balance_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    # ── Customer (denormalized from order) ────────────────────────────────────
    customer_name: Mapped[str] = mapped_column(String(256), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(256), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(20), nullable=False)

    # ── Payment / GPay OCR (denormalized) ─────────────────────────────────────
    upi_transaction_id: Mapped[str | None] = mapped_column(String(100))
    upi_to: Mapped[str | None] = mapped_column(String(200))
    upi_from: Mapped[str | None] = mapped_column(String(200))
    upi_amount: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    upi_date: Mapped[str | None] = mapped_column(String(50))
    upi_time: Mapped[str | None] = mapped_column(String(50))
    payment_status: Mapped[str] = mapped_column(String(32), nullable=False)

    # ── GST breakdown ──────────────────────────────────────────────────────────
    hsn_code: Mapped[str | None] = mapped_column(String(20))
    taxable_value: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    cgst_rate: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    cgst_amount: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    sgst_rate: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    sgst_amount: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    total_tax_amount: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    round_off: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))

    # ── Seller (snapshot from config at invoice time) ─────────────────────────
    seller_name: Mapped[str] = mapped_column(String(200), nullable=False)
    seller_trade_name: Mapped[str | None] = mapped_column(String(200))
    seller_address: Mapped[str | None] = mapped_column(Text)
    seller_gstin: Mapped[str | None] = mapped_column(String(15))
    seller_state: Mapped[str | None] = mapped_column(String(100))
    seller_state_code: Mapped[str | None] = mapped_column(String(5))
    seller_email: Mapped[str | None] = mapped_column(String(256))
    seller_upi_id: Mapped[str | None] = mapped_column(String(100))
    seller_bank_name: Mapped[str | None] = mapped_column(String(100))
    seller_bank_account: Mapped[str | None] = mapped_column(String(30))
    seller_bank_ifsc: Mapped[str | None] = mapped_column(String(15))

    # ── Invoice status ─────────────────────────────────────────────────────────
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="DRAFT")
