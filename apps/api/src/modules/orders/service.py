import json
import uuid
from datetime import UTC, datetime

from fastapi import HTTPException, status

from .cashfree import CashfreeError, create_cashfree_order, verify_webhook_signature
from .models import ADVANCE_AMOUNT, Order, OrderStatus, Payment, PaymentStatus
from .repository import OrderRepository, PaymentRepository
from .schemas import OrderCreate, OrderRead, PaymentRead


def _make_order_number() -> str:
    now = datetime.now(UTC)
    suffix = uuid.uuid4().hex[:6].upper()
    return f"ORD-{now.strftime('%Y%m%d')}-{suffix}"


def _active_payment(order: Order) -> Payment | None:
    """Return the first CREATED or PAID payment on the order, if any."""
    for p in order.payments:
        if p.status in (PaymentStatus.CREATED, PaymentStatus.PAID):
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
        Create an order and initiate a Cashfree payment session.

        Idempotency guarantee:
        - If an Order already exists for `idempotency_key`, no new Order is inserted.
        - If that Order already has a CREATED or PAID Payment, the existing payment
          session is returned without hitting Cashfree again.
        - Only if no valid Payment exists do we call Cashfree and save a new Payment row.
        """
        # ── 1. Check for duplicate submission ──────────────────────────────
        existing = await self.order_repo.get_by_idempotency_key(data.idempotency_key)
        if existing:
            active = _active_payment(existing)
            if active:
                return _order_to_read(existing)
            # Order exists but previous payment attempt failed/expired — fall through
            # to create a new Payment attempt for the same Order.
            order = existing
        else:
            # ── 2. Persist the Order ───────────────────────────────────────
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

        # ── 3. Create a Payment row first so we have a stable UUID for CF ──
        payment = Payment(
            order_id=order.id,
            cashfree_order_id=f"cf-{uuid.uuid4().hex}",  # unique per attempt
            amount=ADVANCE_AMOUNT,
            status=PaymentStatus.CREATED,
        )
        payment = await self.payment_repo.create(payment)

        # ── 4. Call Cashfree (idempotent via cashfree_order_id) ────────────
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
        except CashfreeError as exc:
            # Mark the payment as failed so retries create a fresh one
            payment.status = PaymentStatus.FAILED
            self.payment_repo.db.add(payment)
            await self.payment_repo.db.commit()
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Payment gateway error: {exc}",
            ) from exc

        payment.payment_session_id = cf_resp.get("payment_session_id")
        self.payment_repo.db.add(payment)
        await self.payment_repo.db.commit()
        await self.payment_repo.db.refresh(payment)

        # Reload order with updated payments
        order = await self.order_repo.get_with_payments(order.id)
        return _order_to_read(order)  # type: ignore[arg-type]

    async def handle_webhook(self, raw_body: bytes, timestamp: str, signature: str) -> None:
        """
        Verify Cashfree webhook signature then update Payment + Order status.
        Idempotent: processing the same webhook twice is safe.
        """
        if not verify_webhook_signature(raw_body, timestamp, signature):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid webhook signature",
            )

        event = json.loads(raw_body)
        event_type: str = event.get("type", "")

        # We only act on payment events
        if not event_type.startswith("PAYMENT_"):
            return

        data = event.get("data", {})
        order_data = data.get("order", {})
        payment_data = data.get("payment", {})

        cf_order_id: str = order_data.get("order_id", "")
        cf_payment_id: str | None = payment_data.get("cf_payment_id")
        payment_status_raw: str = payment_data.get("payment_status", "")
        payment_method: str | None = payment_data.get("payment_group")

        payment = await self.payment_repo.get_by_cashfree_order_id(cf_order_id)
        if not payment:
            return  # unknown order — ignore

        # Idempotency: already processed
        if payment.webhook_verified:
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

        # Promote order status on successful advance payment
        if new_status == PaymentStatus.PAID:
            order = payment.order
            order.status = OrderStatus.ADVANCE_PAID
            self.order_repo.db.add(order)
            await self.order_repo.db.commit()
