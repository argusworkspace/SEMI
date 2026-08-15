import uuid
from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .base_model import BaseModel

M = TypeVar("M", bound=BaseModel)


class BaseRepository(Generic[M]):
    model: type[M]

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, id: uuid.UUID) -> M | None:
        return await self.db.get(self.model, id)

    async def list(self, limit: int = 100, offset: int = 0) -> list[M]:
        result = await self.db.execute(
            select(self.model).limit(limit).offset(offset)
        )
        return list(result.scalars().all())

    async def create(self, instance: M) -> M:
        self.db.add(instance)
        await self.db.commit()
        await self.db.refresh(instance)
        return instance

    async def delete(self, instance: M) -> None:
        await self.db.delete(instance)
        await self.db.commit()
