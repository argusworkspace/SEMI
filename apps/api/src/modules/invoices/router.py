import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.modules.orders.repository import OrderRepository, PaymentRepository

from .repository import InvoiceRepository
from .schemas import BuyerCreate, TaxInvoiceRead
from .service import InvoiceService

router = APIRouter(prefix="/invoices", tags=["invoices"])


def get_invoice_service(db: AsyncSession = Depends(get_db)) -> InvoiceService:
    return InvoiceService(
        InvoiceRepository(db),
        OrderRepository(db),
        PaymentRepository(db),
    )


@router.post("", response_model=TaxInvoiceRead, status_code=201)
async def create_invoice(
    data: BuyerCreate,
    service: InvoiceService = Depends(get_invoice_service),
) -> TaxInvoiceRead:
    """Submit buyer details and generate a tax invoice for the order."""
    return await service.create_invoice(data)


@router.get("/{invoice_id}", response_model=TaxInvoiceRead)
async def get_invoice(
    invoice_id: uuid.UUID,
    service: InvoiceService = Depends(get_invoice_service),
) -> TaxInvoiceRead:
    return await service.get_invoice(invoice_id)


@router.get("/by-order/{order_id}", response_model=TaxInvoiceRead)
async def get_invoice_by_order(
    order_id: uuid.UUID,
    service: InvoiceService = Depends(get_invoice_service),
) -> TaxInvoiceRead:
    return await service.get_invoice_by_order(order_id)
