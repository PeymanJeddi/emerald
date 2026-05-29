from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserProfileUpdate


def update_profile(db: Session, user: User, data: UserProfileUpdate) -> User:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def set_profile_photo(db: Session, user: User, url: str) -> User:
    user.profile_photo_url = url
    db.commit()
    db.refresh(user)
    return user
