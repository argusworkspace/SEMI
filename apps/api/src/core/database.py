from collections.abc import AsyncGenerator
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .config import settings


def _build_engine_kwargs(url: str) -> dict:
    """
    asyncpg doesn't support sslmode/channel_binding as URL query params.
    Strip them out and convert sslmode=require → connect_args={'ssl': True}.
    """
    parsed = urlparse(url)
    params = parse_qs(parsed.query, keep_blank_values=True)

    ssl_mode = params.pop("sslmode", [None])[0]
    params.pop("channel_binding", None)

    clean_query = urlencode({k: v[0] for k, v in params.items()})
    clean_url = urlunparse(parsed._replace(query=clean_query))

    connect_args: dict = {}
    if ssl_mode in ("require", "verify-ca", "verify-full"):
        connect_args["ssl"] = True

    return {"url": clean_url, "connect_args": connect_args}


_engine_kwargs = _build_engine_kwargs(settings.database_url)

engine = create_async_engine(
    **_engine_kwargs,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
