import uuid
from datetime import date
from decimal import ROUND_HALF_UP, Decimal

from fastapi import HTTPException

from src.core.config import settings
from src.modules.orders.models import ADVANCE_AMOUNT
from src.modules.orders.repository import OrderRepository, PaymentRepository

from .models import Buyer, TaxInvoice
from .repository import InvoiceRepository
from .schemas import BuyerCreate, TaxInvoiceRead


def _gst_breakdown(gross: Decimal, total_gst_pct: float) -> dict:
    """Split gross (GST-inclusive) amount into taxable + CGST + SGST."""
    rate = Decimal(str(total_gst_pct))
    half = rate / 2
    divisor = 1 + rate / 100
    taxable = (gross / divisor).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    cgst = (taxable * half / 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    sgst = cgst
    total_tax = cgst + sgst
    round_off = (gross - taxable - total_tax).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return {
        "taxable_value": taxable,
        "cgst_rate": half,
        "cgst_amount": cgst,
        "sgst_rate": half,
        "sgst_amount": sgst,
        "total_tax_amount": total_tax,
        "round_off": round_off,
    }


def _financial_year_prefix() -> str:
    today = date.today()
    if today.month >= 4:
        return f"SEMY/{str(today.year)[-2:]}-{str(today.year + 1)[-2:]}/"
    return f"SEMY/{str(today.year - 1)[-2:]}-{str(today.year)[-2:]}/"


class InvoiceService:
    def __init__(
        self,
        invoice_repo: InvoiceRepository,
        order_repo: OrderRepository,
        payment_repo: PaymentRepository,
    ) -> None:
        self.invoice_repo = invoice_repo
        self.order_repo = order_repo
        self.payment_repo = payment_repo

    async def create_invoice(self, data: BuyerCreate) -> TaxInvoiceRead:
        """
        Save buyer details and generate a denormalized TaxInvoice in one transaction.
        Idempotent: re-submitting for the same order returns the existing invoice.
        """
        order = await self.order_repo.get_with_payments(data.order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Return existing invoice if already generated
        existing = await self.invoice_repo.get_invoice_by_order(data.order_id)
        if existing:
            return TaxInvoiceRead.model_validate(existing)

        # Find the most recent payment for OCR data
        payment = None
        for p in sorted(order.payments, key=lambda x: x.created_at, reverse=True):
            payment = p
            break

        # Save or fetch buyer
        buyer = await self.invoice_repo.get_buyer_by_order(data.order_id)
        if not buyer:
            buyer = Buyer(
                order_id=data.order_id,
                name=data.name,
                address=data.address,
                district=data.district,
                pin=data.pin,
                state=data.state,
                gstin=data.gstin,
            )
            buyer = await self.invoice_repo.create_buyer(buyer)

        # Generate invoice number
        fy_prefix = _financial_year_prefix()
        count = await self.invoice_repo.count_invoices_in_fy(fy_prefix)
        invoice_number = f"{fy_prefix}{count + 1:04d}"

        balance = order.unit_price - ADVANCE_AMOUNT

        invoice = TaxInvoice(
            invoice_number=invoice_number,
            order_id=order.id,
            buyer_id=buyer.id,
            payment_id=payment.id if payment else None,

            # Buyer
            buyer_name=data.name,
            buyer_address=data.address,
            buyer_district=data.district,
            buyer_pin=data.pin,
            buyer_state=data.state,
            buyer_gstin=data.gstin,

            # Order
            order_number=order.order_number,
            product_id=order.product_id,
            product_name=order.product_name,
            color=order.color,
            unit_price=order.unit_price,
            advance_amount=ADVANCE_AMOUNT,
            balance_amount=balance,

            # Customer
            customer_name=order.customer_name,
            customer_email=order.customer_email,
            customer_phone=order.customer_phone,

            # Payment / OCR
            upi_transaction_id=payment.upi_ref if payment else None,
            upi_to=payment.upi_to if payment else None,
            upi_from=payment.upi_from if payment else None,
            upi_amount=payment.amount if payment else None,
            upi_date=payment.upi_date if payment else None,
            upi_time=payment.upi_time if payment else None,
            payment_status=payment.status.value if payment else "CREATED",

            # GST
            hsn_code=settings.product_hsn,
            **_gst_breakdown(ADVANCE_AMOUNT, settings.gst_rate),

            # Seller snapshot
            seller_name=settings.seller_legal_name,
            seller_trade_name=settings.seller_trade_name,
            seller_address=settings.seller_address or None,
            seller_gstin=settings.seller_gstin or None,
            seller_state=settings.seller_state,
            seller_state_code=settings.seller_state_code,
            seller_email=settings.seller_email or None,
            seller_upi_id=settings.payment_upi_id,
            seller_bank_name=settings.seller_bank_name or None,
            seller_bank_account=settings.seller_bank_account or None,
            seller_bank_ifsc=settings.seller_bank_ifsc or None,

            status="DRAFT",
        )

        invoice = await self.invoice_repo.create_invoice(invoice)
        await self.invoice_repo.db.commit()
        await self.invoice_repo.db.refresh(invoice)
        return TaxInvoiceRead.model_validate(invoice)

    async def get_invoice(self, invoice_id: uuid.UUID) -> TaxInvoiceRead:
        invoice = await self.invoice_repo.get_invoice(invoice_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        return TaxInvoiceRead.model_validate(invoice)

    async def get_invoice_by_order(self, order_id: uuid.UUID) -> TaxInvoiceRead:
        invoice = await self.invoice_repo.get_invoice_by_order(order_id)
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found for this order")
        return TaxInvoiceRead.model_validate(invoice)
