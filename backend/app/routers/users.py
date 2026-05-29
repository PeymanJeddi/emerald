from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.certificate import Certificate
from app.models.message import Message
from app.models.payment import Payment
from app.models.submission import Submission
from app.models.submission_author import SubmissionAuthor
from app.models.user import User
from app.schemas.certificate import CertificateResponse
from app.schemas.message import MessageResponse
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.schemas.submission import SubmissionCreate, SubmissionResponse, SubmissionUpdate
from app.schemas.submission_author import (
    AuthorInvitationCreate,
    AuthorInvitationResponse,
    SubmissionAuthorCreate,
    SubmissionAuthorResponse,
    UserLookupResponse,
)
from app.schemas.profile import ApplicantProfileResponse, DashboardResponse, ProfileSectionUpdate
from app.schemas.user import UserProfileUpdate, UserResponse
from app.services import (
    file_service,
    payment_service,
    profile_service,
    submission_author_service,
    submission_service,
    user_service,
)

router = APIRouter(prefix="/api/me", tags=["user"])


@router.get("", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return user


@router.get("/profile", response_model=ApplicantProfileResponse)
def get_my_profile(user: User = Depends(get_current_user)):
    return profile_service.profile_to_response(user)


@router.patch("/profile", response_model=ApplicantProfileResponse)
def update_my_profile(
    data: ProfileSectionUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payload = data.model_dump(exclude_unset=True)
    user = profile_service.update_profile(db, user, payload)
    return profile_service.profile_to_response(user)


@router.post("/profile/identity-document", response_model=ApplicantProfileResponse)
async def upload_identity_document(
    document_type: str = Form(...),
    document_number: str = Form(...),
    issuing_country: str = Form(...),
    front: UploadFile = File(...),
    back: UploadFile | None = File(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    import uuid
    from pathlib import Path

    upload_dir = file_service.ensure_upload_dir()
    front_ext = Path(front.filename or "id").suffix
    front_name = f"identity_{user.id}_{uuid.uuid4().hex}_front{front_ext}"
    front_path = upload_dir / front_name
    front_path.write_bytes(await front.read())
    front_url = f"/api/files/{front_name}"
    back_url = None
    if back and back.filename:
        back_ext = Path(back.filename).suffix
        back_name = f"identity_{user.id}_{uuid.uuid4().hex}_back{back_ext}"
        back_path = upload_dir / back_name
        back_path.write_bytes(await back.read())
        back_url = f"/api/files/{back_name}"
    user = profile_service.set_identity_document(
        db,
        user,
        front_url=front_url,
        back_url=back_url,
        document_type=document_type,
        document_number=document_number,
        issuing_country=issuing_country,
    )
    return profile_service.profile_to_response(user)


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from sqlalchemy import func

    profile = profile_service.profile_to_response(user)
    submissions = submission_service.list_user_submissions(db, user.id)[:5]
    recent = [
        {
            "id": s.id,
            "submission_code": s.submission_code,
            "title": s.title,
            "status": s.status.replace("_", " ").title(),
            "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None,
            "last_updated_at": s.last_updated_at.isoformat() if s.last_updated_at else None,
        }
        for s in submissions
    ]
    unread = db.scalar(
        select(func.count())
        .select_from(Message)
        .where(Message.user_id == user.id, Message.is_read == False)  # noqa: E712
    )
    return DashboardResponse(
        user=profile,
        recent_submissions=recent,
        unread_messages_count=unread or 0,
        document_status=profile.get("completion", {}).get("identity_verification_status", "not_submitted"),
    )


@router.patch("/profile/basic", response_model=UserResponse)
def update_basic_profile(
    data: UserProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return user_service.update_profile(db, user, data)


@router.post("/profile/photo", response_model=UserResponse)
async def upload_photo(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    import uuid
    from pathlib import Path

    upload_dir = file_service.ensure_upload_dir()
    ext = Path(file.filename or "photo").suffix
    name = f"profile_{user.id}_{uuid.uuid4().hex}{ext}"
    path = upload_dir / name
    content = await file.read()
    path.write_bytes(content)
    url = f"/api/files/{name}"
    return user_service.set_profile_photo(db, user, url)


@router.get("/submissions", response_model=list[SubmissionResponse])
def my_submissions(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return submission_service.list_user_submissions(db, user.id)


@router.get("/users/lookup", response_model=UserLookupResponse)
def lookup_user_by_email(
    email: str = Query(..., min_length=3),
    submission_id: str | None = Query(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if submission_id:
        submission_service.get_submission(db, submission_id, user)
    result = submission_author_service.lookup_user_by_email(db, email, user, submission_id)
    return UserLookupResponse(**result)


@router.post("/submissions", response_model=SubmissionResponse)
def create_submission(
    data: SubmissionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sub = submission_service.create_submission(db, user, data)
    return submission_service.enrich_submission_response(db, sub)


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sub = submission_service.get_submission(db, submission_id, user)
    if sub.status in ("draft", "revision_requested"):
        submission_author_service.ensure_primary_author(db, sub, user)
    return submission_service.enrich_submission_response(db, sub)


@router.patch("/submissions/{submission_id}", response_model=SubmissionResponse)
def update_submission(
    submission_id: str,
    data: SubmissionUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = submission_service.get_submission(db, submission_id, user)
    sub = submission_service.update_submission(db, submission, data)
    return submission_service.enrich_submission_response(db, sub)


@router.post("/submissions/{submission_id}/submit", response_model=SubmissionResponse)
def submit_submission(
    submission_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = submission_service.get_submission(db, submission_id, user)
    profile_service.assert_can_submit(user)
    sub = submission_service.submit_submission(db, submission)
    return submission_service.enrich_submission_response(db, sub)


@router.post("/submissions/{submission_id}/authors", response_model=SubmissionAuthorResponse)
def add_submission_co_author(
    submission_id: str,
    data: SubmissionAuthorCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = submission_service.get_submission(db, submission_id, user)
    created = submission_author_service.add_co_author(db, submission, user, data.user_id)
    author = db.scalar(
        select(SubmissionAuthor)
        .where(SubmissionAuthor.id == created.id)
        .options(selectinload(SubmissionAuthor.user))
    )
    return SubmissionAuthorResponse.model_validate(
        submission_author_service.author_to_response(author)
    )


@router.delete("/submissions/{submission_id}/authors/{author_id}", status_code=204)
def remove_submission_co_author(
    submission_id: str,
    author_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = submission_service.get_submission(db, submission_id, user)
    submission_author_service.remove_co_author(db, submission, user, author_id)


@router.post(
    "/submissions/{submission_id}/author-invitations",
    response_model=AuthorInvitationResponse,
)
def send_co_author_invitation(
    submission_id: str,
    data: AuthorInvitationCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = submission_service.get_submission(db, submission_id, user)
    return submission_author_service.send_invitation(db, submission, user, data.email)


@router.delete(
    "/submissions/{submission_id}/author-invitations/{invitation_id}",
    status_code=204,
)
def cancel_co_author_invitation(
    submission_id: str,
    invitation_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = submission_service.get_submission(db, submission_id, user)
    submission_author_service.cancel_invitation(db, submission, user, invitation_id)


@router.post(
    "/submissions/{submission_id}/author-invitations/{invitation_id}/resend",
    response_model=AuthorInvitationResponse,
)
def resend_co_author_invitation(
    submission_id: str,
    invitation_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = submission_service.get_submission(db, submission_id, user)
    return submission_author_service.resend_invitation(db, submission, user, invitation_id)


@router.post("/submissions/{submission_id}/files")
async def upload_submission_file(
    submission_id: str,
    file_type: str = "paper",
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    submission = submission_service.get_submission(db, submission_id, user)
    record = await file_service.save_submission_file(db, submission, user, file, file_type)
    return {"id": record.id, "filename": record.original_filename}


@router.get("/certificates", response_model=list[CertificateResponse])
def my_certificates(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(db.scalars(select(Certificate).where(Certificate.user_id == user.id)).all())


@router.get("/payments", response_model=list[PaymentResponse])
def my_payments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return payment_service.list_user_payments(db, user.id)


@router.post("/payments", response_model=PaymentResponse)
def create_payment(
    data: PaymentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return payment_service.create_payment(db, user, data)


@router.get("/messages", response_model=list[MessageResponse])
def my_messages(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(
        db.scalars(select(Message).where(Message.user_id == user.id).order_by(Message.created_at.desc())).all()
    )


@router.patch("/messages/{message_id}/read", response_model=MessageResponse)
def mark_read(
    message_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msg = db.get(Message, message_id)
    if not msg or msg.user_id != user.id:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg
