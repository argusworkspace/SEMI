from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.modules.auth.router import router as auth_router
from src.modules.invoices.router import router as invoices_router
from src.modules.orders.router import router as orders_router
from src.modules.orders.router import webhook_router
from src.modules.users.router import router as users_router

app = FastAPI(title="API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(orders_router)
app.include_router(webhook_router)
app.include_router(invoices_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
