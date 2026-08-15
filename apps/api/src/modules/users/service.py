from fastapi import HTTPException, status

from src.core.security import hash_password

from .models import User
from .repository import UserRepository
from .schemas import UserCreate


class UserService:
    def __init__(self, repo: UserRepository) -> None:
        self.repo = repo

    async def create(self, data: UserCreate) -> User:
        existing = await self.repo.get_by_email(data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )
        user = User(
            email=data.email,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
        )
        return await self.repo.create(user)

    async def get_by_email(self, email: str) -> User | None:
        return await self.repo.get_by_email(email)
