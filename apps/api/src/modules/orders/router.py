import uuid

from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db

from .repository import OrderRepository, PaymentRepository
from .schemas import OrderCreate, OrderRead
from .service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])
webhook_router = APIRouter(prefix="/webhooks", tags=["webhooks"])


def get_order_service(db: AsyncSession = Depends(get_db)) -> OrderService:
    return OrderService(OrderRepository(db), PaymentRepository(db))


@router.post("", response_model=OrderRead, status_code=201)
async def create_order(
    data: OrderCreate,
    service: OrderService = Depends(get_order_service),
) -> OrderRead:
    """
    Create a booking order and return a Cashfree payment session.

    The `idempotency_key` field makes this endpoint safe to retry:
    re-submitting the same key returns the existing order and payment session.
    """
    return await service.create_order(data)


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(
    order_id: uuid.UUID,
    service: OrderService = Depends(get_order_service),
) -> OrderRead:
    from fastapi import HTTPException, status as http_status

    order = await service.order_repo.get_with_payments(order_id)
    if not order:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Order not found")
    from .service import _order_to_read
    return _order_to_read(order)


@webhook_router.post("/cashfree")
async def cashfree_webhook(
    request: Request,
    x_webhook_timestamp: str = Header(...),
    x_webhook_signature: str = Header(...),
    service: OrderService = Depends(get_order_service),
) -> dict:
    """
    Cashfree sends payment events here.
    Signature is verified before any processing — invalid requests are rejected with 400.
    Processing is idempotent: replaying a verified event is a no-op.
    """
    raw_body = await request.body()
    await service.handle_webhook(raw_body, x_webhook_timestamp, x_webhook_signature)
    return {"status": "ok"}
