import uuid

from fastapi import APIRouter, Depends, Header, Request, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.database import get_db

from .repository import OrderRepository, PaymentRepository
from .schemas import OrderCreate, OrderRead, ProofResponse
from .service import OrderService, _order_to_read

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
    Create a booking order. The idempotency_key makes this safe to retry.
    Returns the existing order if the key was already used.
    """
    return await service.create_order(data)


@router.get("/config")
async def payment_config() -> dict:
    """Return UPI payment details for the manual payment flow."""
    return {
        "upi_id": settings.payment_upi_id,
        "upi_name": settings.payment_upi_name,
        "advance_amount": 5000,
        "currency": "INR",
        "cashfree_active": bool(settings.cashfree_app_id),
    }


@router.post("/{order_id}/payment-proof", response_model=ProofResponse)
async def upload_payment_proof(
    order_id: uuid.UUID,
    file: UploadFile = File(..., description="Payment screenshot (JPG/PNG, max 10 MB)"),
    service: OrderService = Depends(get_order_service),
) -> ProofResponse:
    """
    Upload a UPI payment screenshot.
    Runs OCR.space to detect ₹5,000 and a UTR reference, then marks payment UNDER_REVIEW.
    Safe to call multiple times — re-upload overwrites the previous proof.
    """
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
        from fastapi import HTTPException
        raise HTTPException(status_code=415, detail="Upload a JPG or PNG screenshot")

    return await service.upload_proof(order_id, file)


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(
    order_id: uuid.UUID,
    service: OrderService = Depends(get_order_service),
) -> OrderRead:
    from fastapi import HTTPException, status as http_status

    order = await service.order_repo.get_with_payments(order_id)
    if not order:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Order not found")
    return _order_to_read(order)


@webhook_router.post("/cashfree")
async def cashfree_webhook(
    request: Request,
    x_webhook_timestamp: str = Header(...),
    x_webhook_signature: str = Header(...),
    service: OrderService = Depends(get_order_service),
) -> dict:
    raw_body = await request.body()
    await service.handle_webhook(raw_body, x_webhook_timestamp, x_webhook_signature)
    return {"status": "ok"}
