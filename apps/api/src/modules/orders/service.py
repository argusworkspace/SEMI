import base64
import json
import uuid
from datetime import UTC, datetime

from fastapi import HTTPException, UploadFile, status

from src.core.config import settings

from .cashfree import CashfreeError, create_cashfree_order, verify_webhook_signature
from .models import ADVANCE_AMOUNT, Order, OrderStatus, Payment, PaymentStatus
from .ocr import OcrResult, run_ocr  # async OCR via OCR.space API
from .repository import OrderRepository, PaymentRepository
from .schemas import OcrCheck, OrderCreate, OrderRead, PaymentRead, ProofResponse


def _make_order_number() -> str:
    now = datetime.now(UTC)
    suffix = uuid.uuid4().hex[:6].upper()
    return f"ORD-{now.strftime('%Y%m%d')}-{suffix}"


def _active_payment(order: Order) -> Payment | None:
    for p in order.payments:
        if p.status in (PaymentStatus.CREATED, PaymentStatus.UNDER_REVIEW, PaymentStatus.PAID):
            return p
    return None


def _order_to_read(order: Order) -> OrderRead:
    active = _active_payment(order)
    return OrderRead(
        id=order.id,
        order_number=order.order_number,
        idempotency_key=order.idempotency_key,
        product_id=order.product_id,
        product_name=order.product_name,
        color=order.color,
        unit_price=order.unit_price,
        advance_amount=order.advance_amount,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        delivery_pincode=order.delivery_pincode,
        status=order.status,
        created_at=order.created_at,
        active_payment=PaymentRead.model_validate(active) if active else None,
    )


class OrderService:
    def __init__(
        self,
        order_repo: OrderRepository,
        payment_repo: PaymentRepository,
    ) -> None:
        self.order_repo = order_repo
        self.payment_repo = payment_repo

    async def create_order(self, data: OrderCreate) -> OrderRead:
        """
        Create an order. Idempotent on idempotency_key.
        Cashfree is bypassed when CASHFREE_APP_ID is not configured —
        the customer pays manually and uploads a screenshot.
        """
        # ── 1. Idempotency check ───────────────────────────────────────────
        existing = await self.order_repo.get_by_idempotency_key(data.idempotency_key)
        if existing:
            active = _active_payment(existing)
            if active:
                return _order_to_read(existing)
            order = existing
        else:
            # ── 2. Persist Order ───────────────────────────────────────────
            order = Order(
                idempotency_key=data.idempotency_key,
                order_number=_make_order_number(),
                product_id=data.product_id,
                product_name=data.product_name,
                color=data.color,
                unit_price=data.unit_price,
                advance_amount=ADVANCE_AMOUNT,
                customer_name=data.customer_name,
                customer_email=data.customer_email,
                customer_phone=data.customer_phone,
                delivery_pincode=data.delivery_pincode,
                notes=data.notes,
                status=OrderStatus.AWAITING_PAYMENT,
            )
            order = await self.order_repo.create(order)

        # ── 3. Persist Payment row ─────────────────────────────────────────
        payment = Payment(
            order_id=order.id,
            cashfree_order_id=f"cf-{uuid.uuid4().hex}",
            amount=ADVANCE_AMOUNT,
            status=PaymentStatus.CREATED,
        )
        payment = await self.payment_repo.create(payment)

        # ── 4. Cashfree (only when credentials are present) ────────────────
        if settings.cashfree_app_id:
            try:
                cf_resp = await create_cashfree_order(
                    cashfree_order_id=payment.cashfree_order_id,
                    amount=ADVANCE_AMOUNT,
                    customer_id=str(order.id),
                    customer_name=order.customer_name,
                    customer_email=order.customer_email,
                    customer_phone=order.customer_phone,
                    order_note=f"Advance for {order.product_name} ({order.order_number})",
                )
                payment.payment_session_id = cf_resp.get("payment_session_id")
                self.payment_repo.db.add(payment)
                await self.payment_repo.db.commit()
                await self.payment_repo.db.refresh(payment)
            except CashfreeError as exc:
                payment.status = PaymentStatus.FAILED
                self.payment_repo.db.add(payment)
                await self.payment_repo.db.commit()
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Payment gateway error: {exc}",
                ) from exc

        order = await self.order_repo.get_with_payments(order.id)
        return _order_to_read(order)  # type: ignore[arg-type]

    async def upload_proof(self, order_id: uuid.UUID, file: UploadFile) -> ProofResponse:
        """
        Accept a payment screenshot, run OCR, and mark the payment UNDER_REVIEW.
        Idempotent: re-uploading overwrites the previous proof on the same payment.
        """
        order = await self.order_repo.get_with_payments(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        payment = _active_payment(order)
        if not payment:
            raise HTTPException(status_code=400, detail="No active payment for this order")

        if payment.status == PaymentStatus.PAID:
            raise HTTPException(status_code=400, detail="Payment already confirmed")

        image_bytes = await file.read()
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Screenshot must be under 10 MB")

        content_type = file.content_type or "image/jpeg"
        ocr: OcrResult = await run_ocr(image_bytes, content_type)

        payment.screenshot_b64 = base64.b64encode(image_bytes).decode()
        payment.ocr_text = ocr.raw_text
        payment.ocr_amount_detected = ocr.amount_found
        payment.upi_ref = ocr.upi_ref
        payment.upi_to = ocr.upi_to
        payment.upi_from = ocr.upi_from
        payment.upi_date = ocr.upi_date
        payment.upi_time = ocr.upi_time
        payment.status = PaymentStatus.UNDER_REVIEW
        self.payment_repo.db.add(payment)

        order.status = OrderStatus.UNDER_REVIEW
        self.order_repo.db.add(order)

        await self.payment_repo.db.commit()

        return ProofResponse(
            order_id=order.id,
            order_number=order.order_number,
            payment_id=payment.id,
            ocr=OcrCheck(
                amount_found=ocr.amount_found,
                success_keyword_found=ocr.success_keyword_found,
                upi_ref=ocr.upi_ref,
                validated=ocr.validated,
                ocr_available=ocr.ocr_available,
                message=(
                    "Amount detected — we'll verify and confirm within 2 hours."
                    if ocr.amount_found
                    else (
                        "Screenshot received. Our team will manually verify the payment."
                        if not ocr.ocr_available
                        else "Could not detect ₹5,000 in the screenshot. Our team will review."
                    )
                ),
            ),
        )

    async def handle_webhook(self, raw_body: bytes, timestamp: str, signature: str) -> None:
        if not verify_webhook_signature(raw_body, timestamp, signature):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

        event = json.loads(raw_body)
        event_type: str = event.get("type", "")
        if not event_type.startswith("PAYMENT_"):
            return

        data = event.get("data", {})
        cf_order_id: str = data.get("order", {}).get("order_id", "")
        payment_data = data.get("payment", {})
        cf_payment_id: str | None = payment_data.get("cf_payment_id")
        payment_status_raw: str = payment_data.get("payment_status", "")
        payment_method: str | None = payment_data.get("payment_group")

        payment = await self.payment_repo.get_by_cashfree_order_id(cf_order_id)
        if not payment or payment.webhook_verified:
            return

        try:
            new_status = PaymentStatus(payment_status_raw)
        except ValueError:
            new_status = PaymentStatus.FAILED

        await self.payment_repo.update_from_webhook(
            payment,
            status=new_status,
            cashfree_payment_id=cf_payment_id,
            payment_method=payment_method,
            raw_webhook=raw_body.decode(),
        )

        if new_status == PaymentStatus.PAID:
            order = payment.order
            order.status = OrderStatus.ADVANCE_PAID
            self.order_repo.db.add(order)
            await self.order_repo.db.commit()
