"""
Cashfree Payments v3 async client.
Docs: https://docs.cashfree.com/docs/payment-gateway
"""

import base64
import hashlib
import hmac
import json
from decimal import Decimal

import httpx

from src.core.config import settings


class CashfreeError(Exception):
    def __init__(self, message: str, status_code: int = 0):
        super().__init__(message)
        self.status_code = status_code


_HEADERS = {
    "x-api-version": "2023-08-01",
    "Content-Type": "application/json",
}


def _auth_headers() -> dict[str, str]:
    return {
        **_HEADERS,
        "x-client-id": settings.cashfree_app_id,
        "x-client-secret": settings.cashfree_secret_key,
    }


async def create_cashfree_order(
    *,
    cashfree_order_id: str,
    amount: Decimal,
    customer_id: str,
    customer_name: str,
    customer_email: str,
    customer_phone: str,
    order_note: str = "",
) -> dict:
    """
    Create a Cashfree order and return the API response.
    Cashfree deduplicates on `order_id`, so calling this twice with the same
    cashfree_order_id returns the existing order — free idempotency at the gateway.
    """
    payload = {
        "order_id": cashfree_order_id,
        "order_amount": float(amount),
        "order_currency": "INR",
        "order_note": order_note,
        "customer_details": {
            "customer_id": customer_id,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "customer_phone": customer_phone,
        },
    }

    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.post(
            f"{settings.cashfree_base_url}/orders",
            headers=_auth_headers(),
            json=payload,
        )

    if res.status_code not in (200, 201):
        raise CashfreeError(
            f"Cashfree order creation failed: {res.text}", status_code=res.status_code
        )

    return res.json()


def verify_webhook_signature(raw_body: bytes, timestamp: str, signature: str) -> bool:
    """
    Verify the HMAC-SHA256 signature Cashfree sends with each webhook.

    Cashfree signs: HMAC-SHA256(timestamp + rawBody, secret_key)
    and base64-encodes the result.
    """
    message = (timestamp + raw_body.decode("utf-8")).encode()
    expected = base64.b64encode(
        hmac.new(
            settings.cashfree_secret_key.encode(),
            message,
            hashlib.sha256,
        ).digest()
    ).decode()
    return hmac.compare_digest(expected, signature)
