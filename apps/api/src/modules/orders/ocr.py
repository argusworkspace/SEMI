"""
Payment screenshot OCR via OCR.space free API.
Get a free key at https://ocr.space/ocrapi (25,000 requests/month).
The public demo key "helloworld" works with rate limiting.
"""

import base64
import re
from dataclasses import dataclass

import httpx

from src.core.config import settings

OCR_SPACE_URL = "https://api.ocr.space/parse/image"

AMOUNT_RE = re.compile(
    r"(?:₹|Rs\.?|INR)\s*5[,.]?000(?:\.00)?"
    r"|5[,.]?000(?:\.00)?\s*(?:₹|Rs\.?|INR)?"
    r"|five\s+thousand",
    re.IGNORECASE,
)

SUCCESS_RE = re.compile(
    r"\b(?:payment|transfer|transaction|debit)\s+(?:successful|success|complete|done|confirmed|received)\b"
    r"|\bsuccessfully\s+(?:sent|paid|transferred)\b",
    re.IGNORECASE,
)

UTR_RE = re.compile(
    r"\b(?:UTR|Ref(?:erence)?|Txn|Transaction|UPI)[:\s#.]*([A-Z0-9]{10,22})\b",
    re.IGNORECASE,
)
NUMERIC_REF_RE = re.compile(r"\b\d{12,15}\b")


@dataclass
class OcrResult:
    raw_text: str = ""
    amount_found: bool = False
    success_keyword_found: bool = False
    upi_ref: str | None = None
    validated: bool = False
    ocr_available: bool = True
    error: str | None = None


async def run_ocr(image_bytes: bytes, content_type: str = "image/jpeg") -> OcrResult:
    """
    Send image to OCR.space and extract payment details.
    Falls back gracefully if the API is unavailable.
    """
    b64 = base64.b64encode(image_bytes).decode()
    data_uri = f"data:{content_type};base64,{b64}"

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                OCR_SPACE_URL,
                data={
                    "base64Image": data_uri,
                    "language": "eng",
                    "isOverlayRequired": "false",
                    "OCREngine": "2",          # Engine 2 is more accurate for screenshots
                    "scale": "true",
                    "detectOrientation": "true",
                },
                headers={"apikey": settings.ocr_space_api_key},
            )
        resp.raise_for_status()
        payload = resp.json()

        if payload.get("IsErroredOnProcessing"):
            error_msg = payload.get("ErrorMessage", ["Unknown OCR error"])[0]
            return OcrResult(ocr_available=True, error=error_msg)

        results = payload.get("ParsedResults", [])
        text = "\n".join(r.get("ParsedText", "") for r in results)
        return _analyse(text)

    except httpx.HTTPError as exc:
        return OcrResult(
            ocr_available=False,
            error=f"OCR API unreachable: {exc}",
        )
    except Exception as exc:
        return OcrResult(
            ocr_available=False,
            error=f"OCR error: {exc}",
        )


def _analyse(text: str, *, available: bool = True, error: str | None = None) -> OcrResult:
    amount_found = bool(AMOUNT_RE.search(text))
    success_found = bool(SUCCESS_RE.search(text))

    upi_ref: str | None = None
    m = UTR_RE.search(text)
    if m:
        upi_ref = m.group(1)
    else:
        m = NUMERIC_REF_RE.search(text)
        if m:
            upi_ref = m.group(0)

    return OcrResult(
        raw_text=text,
        amount_found=amount_found,
        success_keyword_found=success_found,
        upi_ref=upi_ref,
        validated=amount_found,
        ocr_available=available,
        error=error,
    )
