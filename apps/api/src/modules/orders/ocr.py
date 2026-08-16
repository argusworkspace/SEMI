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

# GPay/PhonePe: "Paid to SEMY Mobility", "To SEMY Mobility", "to semy@ybl"
UPI_TO_RE = re.compile(
    r"\bpaid\s+to[:\s]+([^\n]{3,80})"
    r"|\bto\s+([A-Za-z][A-Za-z0-9 @._-]{2,60}?)(?=\s*\n|\s{2,}|$|\bUPI\b|\bRef\b)",
    re.IGNORECASE,
)

# "From Riyaz", "Paid by 9876543210@ybl"
UPI_FROM_RE = re.compile(
    r"\b(?:from|paid\s+by|sent\s+by)[:\s]+([A-Za-z0-9 @._-]{3,60}?)(?=\s*\n|$)",
    re.IGNORECASE,
)

# Date: "12 Aug 2026", "Aug 12, 2026", "12/08/2026", "2026-08-12"
DATE_RE = re.compile(
    r"\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}"
    r"|\d{4}-\d{2}-\d{2}"
    r"|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}"
    r"|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})\b",
    re.IGNORECASE,
)

# Time: "3:45 PM", "15:45", "3:45:12 PM"
TIME_RE = re.compile(r"\b(\d{1,2}:\d{2}(?::\d{2})?\s*(?:[AP]M)?)\b", re.IGNORECASE)


@dataclass
class OcrResult:
    raw_text: str = ""
    amount_found: bool = False
    success_keyword_found: bool = False
    upi_ref: str | None = None
    upi_to: str | None = None
    upi_from: str | None = None
    upi_date: str | None = None
    upi_time: str | None = None
    validated: bool = False
    ocr_available: bool = True
    error: str | None = None


async def run_ocr(image_bytes: bytes, content_type: str = "image/jpeg") -> OcrResult:
    """Send image to OCR.space and extract payment details."""
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
                    "OCREngine": "2",
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
        return OcrResult(ocr_available=False, error=f"OCR API unreachable: {exc}")
    except Exception as exc:
        return OcrResult(ocr_available=False, error=f"OCR error: {exc}")


def _analyse(text: str, *, available: bool = True, error: str | None = None) -> OcrResult:
    amount_found = bool(AMOUNT_RE.search(text))
    success_found = bool(SUCCESS_RE.search(text))

    # Transaction reference / UTR
    upi_ref: str | None = None
    m = UTR_RE.search(text)
    if m:
        upi_ref = m.group(1)
    else:
        m = NUMERIC_REF_RE.search(text)
        if m:
            upi_ref = m.group(0)

    # Recipient
    upi_to: str | None = None
    m = UPI_TO_RE.search(text)
    if m:
        upi_to = (m.group(1) or m.group(2) or "").strip().rstrip(",;")

    # Sender
    upi_from: str | None = None
    m = UPI_FROM_RE.search(text)
    if m:
        upi_from = m.group(1).strip()

    # Date
    upi_date: str | None = None
    m = DATE_RE.search(text)
    if m:
        upi_date = m.group(0).strip()

    # Time (pick the last match to skip "3:45 PM" appearing twice etc.)
    upi_time: str | None = None
    times = TIME_RE.findall(text)
    if times:
        upi_time = times[-1].strip()

    return OcrResult(
        raw_text=text,
        amount_found=amount_found,
        success_keyword_found=success_found,
        upi_ref=upi_ref,
        upi_to=upi_to or None,
        upi_from=upi_from or None,
        upi_date=upi_date,
        upi_time=upi_time,
        validated=amount_found,
        ocr_available=available,
        error=error,
    )
