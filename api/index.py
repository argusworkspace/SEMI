import sys
import os

# Make apps/api/ importable so `from src.main import app` works
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "apps", "api"))

from src.main import app  # noqa: F401 — Vercel picks up the ASGI `app`
