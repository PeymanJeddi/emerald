from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import AuthUserResponse, LoginRequest, RegisterRequest, TokenResponse
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    user = auth_service.register_user(db, data)
    return TokenResponse(access_token=auth_service.issue_token(user))


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate(db, data.email, data.password)
    return TokenResponse(access_token=auth_service.issue_token(user))


@router.post("/admin/login", response_model=TokenResponse)
def admin_login(data: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate_admin(db, data.email, data.password)
    return TokenResponse(access_token=auth_service.issue_token(user))


@router.post("/refresh", response_model=TokenResponse)
def refresh(user: User = Depends(get_current_user)):
    return TokenResponse(access_token=auth_service.issue_token(user))


@router.get("/me", response_model=AuthUserResponse)
def me(user: User = Depends(get_current_user)):
    return user
