import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import Buyer, TaxInvoice


class InvoiceRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_buyer_by_order(self, order_id: uuid.UUID) -> Buyer | None:
        result = await self.db.execute(
            select(Buyer).where(Buyer.order_id == order_id)
        )
        return result.scalar_one_or_none()

    async def create_buyer(self, buyer: Buyer) -> Buyer:
        self.db.add(buyer)
        await self.db.flush()
        return buyer

    async def get_invoice(self, invoice_id: uuid.UUID) -> TaxInvoice | None:
        result = await self.db.execute(
            select(TaxInvoice).where(TaxInvoice.id == invoice_id)
        )
        return result.scalar_one_or_none()

    async def get_invoice_by_order(self, order_id: uuid.UUID) -> TaxInvoice | None:
        result = await self.db.execute(
            select(TaxInvoice).where(TaxInvoice.order_id == order_id)
        )
        return result.scalar_one_or_none()

    async def create_invoice(self, invoice: TaxInvoice) -> TaxInvoice:
        self.db.add(invoice)
        await self.db.flush()
        return invoice

    async def count_invoices_in_fy(self, fy_prefix: str) -> int:
        result = await self.db.execute(
            select(TaxInvoice).where(TaxInvoice.invoice_number.startswith(fy_prefix))
        )
        return len(result.scalars().all())
