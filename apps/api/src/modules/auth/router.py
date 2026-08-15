from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.modules.users.repository import UserRepository
from src.modules.users.schemas import UserCreate, UserRead
from src.modules.users.service import UserService

from .schemas import Token
from .service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db))


def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(UserRepository(db))


@router.post("/login", response_model=Token)
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(get_auth_service),
) -> Token:
    token = await service.authenticate(form.username, form.password)
    return Token(access_token=token)


@router.post("/register", response_model=UserRead, status_code=201)
async def register(
    data: UserCreate,
    service: UserService = Depends(get_user_service),
) -> UserRead:
    user = await service.create(data)
    return UserRead.model_validate(user)
