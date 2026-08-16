import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.modules.shared.base_repository import BaseRepository

from .models import Order, Payment, PaymentStatus


class OrderRepository(BaseRepository[Order]):
    model = Order

    async def get_by_idempotency_key(self, key: str) -> Order | None:
        result = await self.db.execute(
            select(Order)
            .where(Order.idempotency_key == key)
            .options(selectinload(Order.payments))
        )
        return result.scalar_one_or_none()

    async def get_with_payments(self, order_id: uuid.UUID) -> Order | None:
        result = await self.db.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(selectinload(Order.payments))
        )
        return result.scalar_one_or_none()

    async def get_by_order_number(self, order_number: str) -> Order | None:
        result = await self.db.execute(
            select(Order).where(Order.order_number == order_number)
        )
        return result.scalar_one_or_none()


class PaymentRepository(BaseRepository[Payment]):
    model = Payment

    async def get_by_cashfree_order_id(self, cf_order_id: str) -> Payment | None:
        result = await self.db.execute(
            select(Payment)
            .where(Payment.cashfree_order_id == cf_order_id)
            .options(selectinload(Payment.order))
        )
        return result.scalar_one_or_none()

    async def get_active_for_order(self, order_id: uuid.UUID) -> Payment | None:
        """Return an existing CREATED or PAID payment for the order, if any."""
        result = await self.db.execute(
            select(Payment).where(
                Payment.order_id == order_id,
                Payment.status.in_([PaymentStatus.CREATED, PaymentStatus.PAID]),
            )
        )
        return result.scalar_one_or_none()

    async def update_from_webhook(
        self,
        payment: Payment,
        *,
        status: PaymentStatus,
        cashfree_payment_id: str | None,
        payment_method: str | None,
        raw_webhook: str,
    ) -> Payment:
        payment.status = status
        payment.cashfree_payment_id = cashfree_payment_id
        payment.payment_method = payment_method
        payment.webhook_verified = True
        payment.raw_webhook = raw_webhook
        self.db.add(payment)
        await self.db.commit()
        await self.db.refresh(payment)
        return payment
