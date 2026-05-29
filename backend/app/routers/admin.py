from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.audit_log import AuditLog
from app.models.certificate import Certificate
from app.models.event import Event
from app.models.payment import Payment
from app.models.submission import Submission
from app.models.user import User
from app.schemas.certificate import CertificateCreate, CertificateResponse, CertificateRevoke, CertificateUpdate
from app.schemas.cms import CMSPageCreate, CMSPageResponse, CMSPageUpdate, CMSSectionCreate, CMSSectionResponse, CMSSectionUpdate
from app.schemas.hero_carousel import (
    HeroCarouselReorderRequest,
    HeroCarouselSlideCreate,
    HeroCarouselSlideResponse,
    HeroCarouselSlideUpdate,
)
from app.schemas.testimonial import (
    TestimonialCreate,
    TestimonialReorderRequest,
    TestimonialResponse,
    TestimonialUpdate,
)
from app.schemas.event import EventCreate, EventResponse, EventUpdate
from app.schemas.payment import PaymentResponse
from app.schemas.submission import SubmissionNotesUpdate, SubmissionResponse, SubmissionStatusUpdate
from app.schemas.user import AdminUserUpdate, RoleUpdate, StatusUpdate, UserResponse
from app.services import (
    audit_service,
    certificate_service,
    cms_service,
    event_service,
    hero_carousel_service,
    payment_service,
    submission_service,
    testimonial_service,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])
admin_user = Depends(require_roles("admin", "staff"))


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), _: User = admin_user):
    return {
        "total_users": db.scalar(select(func.count()).select_from(User)),
        "active_submissions": db.scalar(
            select(func.count()).select_from(Submission).where(Submission.status.notin_(["draft", "archived", "rejected"]))
        ),
        "pending_payments": db.scalar(
            select(func.count()).select_from(Payment).where(Payment.status.in_(["submitted", "under_review", "pending"]))
        ),
        "issued_certificates": db.scalar(select(func.count()).select_from(Certificate).where(Certificate.status == "verified")),
        "published_events": db.scalar(select(func.count()).select_from(Event).where(Event.is_public == True)),  # noqa: E712
        "pending_reviews": db.scalar(
            select(func.count()).select_from(Submission).where(
                Submission.status.in_(["submitted", "administrative_screening", "document_review", "academic_review"])
            )
        ),
    }


# Users
@router.get("/users", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db), _: User = admin_user):
    return list(db.scalars(select(User).order_by(User.created_at.desc())).all())


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db), _: User = admin_user):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    audit_service.log_action(db, actor_user_id=actor.id, action="user.update", entity_type="user", entity_id=user_id)
    db.refresh(user)
    return user


@router.patch("/users/{user_id}/role", response_model=UserResponse)
def update_role(
    user_id: str,
    data: RoleUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = data.role
    db.commit()
    audit_service.log_action(
        db, actor_user_id=actor.id, action="user.role_change", entity_type="user", entity_id=user_id, metadata={"role": data.role}
    )
    db.refresh(user)
    return user


@router.patch("/users/{user_id}/status", response_model=UserResponse)
def update_status(
    user_id: str,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = data.is_active
    db.commit()
    audit_service.log_action(db, actor_user_id=actor.id, action="user.status_change", entity_type="user", entity_id=user_id)
    db.refresh(user)
    return user


# Events
@router.get("/events", response_model=list[EventResponse])
def list_events(db: Session = Depends(get_db), _: User = admin_user):
    return list(db.scalars(select(Event).order_by(Event.created_at.desc())).all())


@router.post("/events", response_model=EventResponse)
def create_event(data: EventCreate, db: Session = Depends(get_db), actor: User = admin_user):
    event = event_service.create_event(db, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="event.create", entity_type="event", entity_id=event.id)
    return event


@router.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: str, db: Session = Depends(get_db), _: User = admin_user):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.patch("/events/{event_id}", response_model=EventResponse)
def update_event(
    event_id: str,
    data: EventUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event = event_service.update_event(db, event, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="event.update", entity_type="event", entity_id=event_id)
    return event


@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: str, db: Session = Depends(get_db), actor: User = admin_user):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    audit_service.log_action(db, actor_user_id=actor.id, action="event.delete", entity_type="event", entity_id=event_id)


# Submissions
@router.get("/submissions", response_model=list[SubmissionResponse])
def list_submissions(
    status_filter: str | None = Query(None, alias="status"),
    event_id: str | None = None,
    db: Session = Depends(get_db),
    _: User = admin_user,
):
    q = select(Submission).options(selectinload(Submission.files)).order_by(Submission.last_updated_at.desc())
    if status_filter:
        q = q.where(Submission.status == status_filter)
    if event_id:
        q = q.where(Submission.event_id == event_id)
    return list(db.scalars(q).all())


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
def get_submission(submission_id: str, db: Session = Depends(get_db), _: User = admin_user):
    return submission_service.get_submission(db, submission_id)


@router.patch("/submissions/{submission_id}/status", response_model=SubmissionResponse)
def update_submission_status(
    submission_id: str,
    data: SubmissionStatusUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    submission = submission_service.get_submission(db, submission_id)
    submission.status = data.status
    if data.status == "certificate_issued":
        certificate_service.issue_certificate_for_submission(db, submission)
    db.commit()
    audit_service.log_action(
        db,
        actor_user_id=actor.id,
        action="submission.status_change",
        entity_type="submission",
        entity_id=submission_id,
        metadata={"status": data.status},
    )
    db.refresh(submission)
    return submission


@router.patch("/submissions/{submission_id}/notes", response_model=SubmissionResponse)
def update_submission_notes(
    submission_id: str,
    data: SubmissionNotesUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    submission = submission_service.get_submission(db, submission_id)
    submission.notes = data.notes
    db.commit()
    audit_service.log_action(db, actor_user_id=actor.id, action="submission.notes", entity_type="submission", entity_id=submission_id)
    db.refresh(submission)
    return submission


# Certificates
@router.get("/certificates", response_model=list[CertificateResponse])
def list_certificates(db: Session = Depends(get_db), _: User = admin_user):
    return list(db.scalars(select(Certificate).order_by(Certificate.created_at.desc())).all())


@router.post("/certificates", response_model=CertificateResponse)
def create_certificate(data: CertificateCreate, db: Session = Depends(get_db), actor: User = admin_user):
    cert = certificate_service.create_certificate(db, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="certificate.create", entity_type="certificate", entity_id=cert.id)
    return cert


@router.get("/certificates/{cert_id}", response_model=CertificateResponse)
def get_certificate(cert_id: str, db: Session = Depends(get_db), _: User = admin_user):
    cert = db.get(Certificate, cert_id)
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert


@router.patch("/certificates/{cert_id}", response_model=CertificateResponse)
def update_certificate(
    cert_id: str,
    data: CertificateUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    cert = db.get(Certificate, cert_id)
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    cert = certificate_service.update_certificate(db, cert, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="certificate.update", entity_type="certificate", entity_id=cert_id)
    return cert


@router.post("/certificates/{cert_id}/revoke", response_model=CertificateResponse)
def revoke_certificate(
    cert_id: str,
    data: CertificateRevoke,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    cert = db.get(Certificate, cert_id)
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    cert = certificate_service.revoke_certificate(db, cert, data.revoke_reason)
    audit_service.log_action(db, actor_user_id=actor.id, action="certificate.revoke", entity_type="certificate", entity_id=cert_id)
    return cert


# Payments
@router.get("/payments", response_model=list[PaymentResponse])
def list_payments(
    status_filter: str | None = Query(None, alias="status"),
    db: Session = Depends(get_db),
    _: User = admin_user,
):
    q = select(Payment).order_by(Payment.created_at.desc())
    if status_filter:
        q = q.where(Payment.status == status_filter)
    return list(db.scalars(q).all())


@router.get("/payments/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: str, db: Session = Depends(get_db), _: User = admin_user):
    payment = db.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@router.patch("/payments/{payment_id}/approve", response_model=PaymentResponse)
def approve_payment(payment_id: str, db: Session = Depends(get_db), actor: User = admin_user):
    payment = db.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    payment = payment_service.approve_payment(db, payment)
    audit_service.log_action(db, actor_user_id=actor.id, action="payment.approve", entity_type="payment", entity_id=payment_id)
    return payment


@router.patch("/payments/{payment_id}/reject", response_model=PaymentResponse)
def reject_payment(payment_id: str, db: Session = Depends(get_db), actor: User = admin_user):
    payment = db.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    payment = payment_service.reject_payment(db, payment)
    audit_service.log_action(db, actor_user_id=actor.id, action="payment.reject", entity_type="payment", entity_id=payment_id)
    return payment


# CMS
@router.get("/cms/pages", response_model=list[CMSPageResponse])
def list_pages(db: Session = Depends(get_db), _: User = admin_user):
    from app.models.cms import CMSPage

    return list(db.scalars(select(CMSPage)).all())


@router.post("/cms/pages", response_model=CMSPageResponse)
def create_page(data: CMSPageCreate, db: Session = Depends(get_db), actor: User = admin_user):
    page = cms_service.create_page(db, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.page.create", entity_type="cms_page", entity_id=page.id)
    return page


@router.get("/cms/pages/{page_id}", response_model=CMSPageResponse)
def get_page(page_id: str, db: Session = Depends(get_db), _: User = admin_user):
    from app.models.cms import CMSPage

    page = db.get(CMSPage, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.patch("/cms/pages/{page_id}", response_model=CMSPageResponse)
def update_page(
    page_id: str,
    data: CMSPageUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    from app.models.cms import CMSPage

    page = db.get(CMSPage, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    page = cms_service.update_page(db, page, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.page.update", entity_type="cms_page", entity_id=page_id)
    return page


@router.get("/cms/sections", response_model=list[CMSSectionResponse])
def list_sections(page_key: str | None = None, db: Session = Depends(get_db), _: User = admin_user):
    from app.models.cms import CMSSection

    q = select(CMSSection).order_by(CMSSection.order_index)
    if page_key:
        q = q.where(CMSSection.page_key == page_key)
    return list(db.scalars(q).all())


@router.post("/cms/sections", response_model=CMSSectionResponse)
def create_section(data: CMSSectionCreate, db: Session = Depends(get_db), actor: User = admin_user):
    section = cms_service.create_section(db, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.section.create", entity_type="cms_section", entity_id=section.id)
    return section


@router.patch("/cms/sections/{section_id}", response_model=CMSSectionResponse)
def update_section(
    section_id: str,
    data: CMSSectionUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    from app.models.cms import CMSSection

    section = db.get(CMSSection, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    section = cms_service.update_section(db, section, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.section.update", entity_type="cms_section", entity_id=section_id)
    return section


# Hero carousel
@router.get("/cms/hero-slides", response_model=list[HeroCarouselSlideResponse])
def list_hero_slides(db: Session = Depends(get_db), _: User = admin_user):
    return hero_carousel_service.list_all_slides(db)


@router.post("/cms/hero-slides", response_model=HeroCarouselSlideResponse)
def create_hero_slide(data: HeroCarouselSlideCreate, db: Session = Depends(get_db), actor: User = admin_user):
    slide = hero_carousel_service.create_slide(db, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.hero_slide.create", entity_type="hero_slide", entity_id=slide.id)
    return slide


@router.get("/cms/hero-slides/{slide_id}", response_model=HeroCarouselSlideResponse)
def get_hero_slide(slide_id: str, db: Session = Depends(get_db), _: User = admin_user):
    return hero_carousel_service.get_slide(db, slide_id)


@router.patch("/cms/hero-slides/{slide_id}", response_model=HeroCarouselSlideResponse)
def update_hero_slide(
    slide_id: str,
    data: HeroCarouselSlideUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    slide = hero_carousel_service.get_slide(db, slide_id)
    slide = hero_carousel_service.update_slide(db, slide, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.hero_slide.update", entity_type="hero_slide", entity_id=slide_id)
    return slide


@router.delete("/cms/hero-slides/{slide_id}")
def delete_hero_slide(slide_id: str, db: Session = Depends(get_db), actor: User = admin_user):
    slide = hero_carousel_service.get_slide(db, slide_id)
    hero_carousel_service.delete_slide(db, slide)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.hero_slide.delete", entity_type="hero_slide", entity_id=slide_id)
    return {"ok": True}


@router.post("/cms/hero-slides/reorder", response_model=list[HeroCarouselSlideResponse])
def reorder_hero_slides(
    data: HeroCarouselReorderRequest,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    slides = hero_carousel_service.reorder_slides(db, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.hero_slide.reorder", entity_type="hero_slide", entity_id="batch")
    return slides


@router.post("/cms/hero-slides/{slide_id}/image", response_model=HeroCarouselSlideResponse)
def upload_hero_slide_image(
    slide_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    slide = hero_carousel_service.get_slide(db, slide_id)
    slide = hero_carousel_service.save_slide_image(db, slide, file)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.hero_slide.image", entity_type="hero_slide", entity_id=slide_id)
    return slide


# Testimonials
@router.get("/cms/testimonials", response_model=list[TestimonialResponse])
def list_testimonials_admin(db: Session = Depends(get_db), _: User = admin_user):
    return testimonial_service.list_all_testimonials(db)


@router.post("/cms/testimonials", response_model=TestimonialResponse)
def create_testimonial(data: TestimonialCreate, db: Session = Depends(get_db), actor: User = admin_user):
    item = testimonial_service.create_testimonial(db, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.testimonial.create", entity_type="testimonial", entity_id=item.id)
    return item


@router.patch("/cms/testimonials/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: str,
    data: TestimonialUpdate,
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    item = testimonial_service.get_testimonial(db, testimonial_id)
    item = testimonial_service.update_testimonial(db, item, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.testimonial.update", entity_type="testimonial", entity_id=testimonial_id)
    return item


@router.delete("/cms/testimonials/{testimonial_id}")
def delete_testimonial(testimonial_id: str, db: Session = Depends(get_db), actor: User = admin_user):
    item = testimonial_service.get_testimonial(db, testimonial_id)
    testimonial_service.delete_testimonial(db, item)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.testimonial.delete", entity_type="testimonial", entity_id=testimonial_id)
    return {"ok": True}


@router.post("/cms/testimonials/reorder", response_model=list[TestimonialResponse])
def reorder_testimonials(data: TestimonialReorderRequest, db: Session = Depends(get_db), actor: User = admin_user):
    items = testimonial_service.reorder_testimonials(db, data)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.testimonial.reorder", entity_type="testimonial", entity_id="batch")
    return items


@router.post("/cms/testimonials/{testimonial_id}/image", response_model=TestimonialResponse)
def upload_testimonial_image(
    testimonial_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    actor: User = admin_user,
):
    item = testimonial_service.get_testimonial(db, testimonial_id)
    item = testimonial_service.save_profile_image(db, item, file)
    audit_service.log_action(db, actor_user_id=actor.id, action="cms.testimonial.image", entity_type="testimonial", entity_id=testimonial_id)
    return item


@router.get("/audit-logs")
def audit_logs(limit: int = 100, db: Session = Depends(get_db), _: User = admin_user):
    logs = list(db.scalars(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)).all())
    return [
        {
            "id": l.id,
            "actor_user_id": l.actor_user_id,
            "action": l.action,
            "entity_type": l.entity_type,
            "entity_id": l.entity_id,
            "metadata_json": l.metadata_json,
            "created_at": l.created_at,
        }
        for l in logs
    ]
