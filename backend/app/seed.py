"""Seed development data. Idempotent — skips if admin already exists."""
from datetime import date

from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.certificate import Certificate
from app.models.cms import CMSPage, CMSSection
from app.models.event import Event
from app.models.hero_carousel import HeroCarouselSlide
from app.models.testimonial import Testimonial
from app.models.message import Message
from app.models.submission import Submission
from app.models.user import User
from app.seed_events_catalog import ensure_events_catalog
from app.utils.ids import generate_id


TERMS_MARKDOWN = """## 1. Acceptance of Terms

By accessing or using **Emerald Scholars Congress** ("the Platform"), you agree to these Terms and Conditions.

## 2. Eligibility

The Platform is intended for researchers, academics, and institutional participants. You must provide accurate registration information.

## 3. Submissions and Content

You retain ownership of scholarly materials you submit. By uploading content, you grant the Platform a limited license to store and process submissions for conference administration.

## 4. Certificates and Verification

Certificates reflect participation records as documented by event organizers. Verification is provided for informational purposes.

## 5. Acceptable Use

You agree not to misuse the Platform or attempt unauthorized access to data or systems.

## 6. Changes

We may update these Terms from time to time. Material changes will be reflected on this page.

## 7. Contact

For questions, please use the [Contact](/contact) page."""


def ensure_homepage_sections(db) -> None:
    hero = db.scalar(
        select(CMSSection).where(
            CMSSection.page_key == "homepage",
            CMSSection.section_key == "hero",
        )
    )
    if hero:
        hero.title = "Join Our International Academic Conference"
        hero.subtitle = (
            "Create your applicant account, submit your academic materials, and complete the "
            "verification process to become eligible for conference participation and publication."
        )
        hero.config_json = {
            "primary_cta_label": "Apply Now",
            "primary_cta_url": "/portal/signup",
        }
    services = db.scalar(
        select(CMSSection).where(
            CMSSection.page_key == "homepage",
            CMSSection.section_key == "services",
        )
    )
    if not services:
        features = db.scalar(
            select(CMSSection).where(
                CMSSection.page_key == "homepage",
                CMSSection.section_key == "features",
            )
        )
        if features:
            features.section_key = "services"
            features.title = "Our Services"
            features.subtitle = "You are only three steps away from our conference."
            features.config_json = {
                "steps": [
                    {
                        "step": 1,
                        "title": "Submit Your Work",
                        "description": (
                            "Create your account and upload your academic documents, research paper, abstract, "
                            "and required information."
                        ),
                    },
                    {
                        "step": 2,
                        "title": "Eligibility Review & Revision",
                        "description": (
                            "Our team reviews your documents and submission. If corrections or additional materials "
                            "are needed, you will be notified through your portal."
                        ),
                    },
                    {
                        "step": 3,
                        "title": "Approval for Publication",
                        "description": (
                            "After successful verification and academic approval, your submission becomes eligible "
                            "for official conference participation and publication."
                        ),
                    },
                ]
            }
            services = features
    if services:
        services.title = "Our Services"
        services.subtitle = "You are only three steps away from our conference."
        services.config_json = {
            "steps": [
                {
                    "step": 1,
                    "title": "Submit Your Work",
                    "description": (
                        "Create your account and upload your academic documents, research paper, abstract, "
                        "and required information."
                    ),
                },
                {
                    "step": 2,
                    "title": "Eligibility Review & Revision",
                    "description": (
                        "Our team reviews your documents and submission. If corrections or additional materials "
                        "are needed, you will be notified through your portal."
                    ),
                },
                {
                    "step": 3,
                    "title": "Approval for Publication",
                    "description": (
                        "After successful verification and academic approval, your submission becomes eligible "
                        "for official conference participation and publication."
                    ),
                },
            ]
        }
    db.commit()


ADVANTAGE_CARDS = [
    {
        "title": "Academic Verification",
        "description": "All submissions go through structured verification and integrity review processes.",
    },
    {
        "title": "International Publication Opportunities",
        "description": "Eligible submissions may qualify for official publication and academic exposure.",
    },
    {
        "title": "Professional Review Process",
        "description": "Our academic teams review and guide submissions through the evaluation workflow.",
    },
    {
        "title": "Secure Applicant Portal",
        "description": "Applicants can securely manage submissions, revisions, and conference participation through their portal.",
    },
]


def ensure_hero_slides(db) -> None:
    if db.scalars(select(HeroCarouselSlide).limit(1)).first():
        return
    db.add_all(
        [
            HeroCarouselSlide(
                title="Join Our International Academic Conference",
                subtitle="Submit your academic work and become eligible for international publication.",
                description=(
                    "Create your applicant account, complete verification, and join leading scholars "
                    "through our official conference platform."
                ),
                cta_label="Apply Now",
                cta_url="/portal/signup",
                cta_type="internal",
                display_priority=0,
                is_active=True,
            ),
            HeroCarouselSlide(
                title="International Publication Pathways",
                subtitle="Professional review, secure submissions, and verified academic credentials.",
                description="Discover upcoming conferences and submit your research through a trusted scholarly workflow.",
                cta_label="Start Your Application",
                cta_url="/portal/signup",
                cta_type="internal",
                display_priority=1,
                is_active=True,
            ),
        ]
    )
    db.commit()
    print("Hero carousel slides created.")


def ensure_homepage_extras(db) -> None:
    advantages = db.scalar(
        select(CMSSection).where(
            CMSSection.page_key == "homepage",
            CMSSection.section_key == "advantages",
        )
    )
    if not advantages:
        db.add(
            CMSSection(
                page_key="homepage",
                section_key="advantages",
                title="Why Join Our Conference Platform",
                subtitle=(
                    "Professional academic verification, international publication opportunities, "
                    "and a streamlined submission process."
                ),
                config_json={"cards": ADVANTAGE_CARDS},
                order_index=2,
                is_active=True,
            )
        )
    conferences = db.scalar(
        select(CMSSection).where(
            CMSSection.page_key == "homepage",
            CMSSection.section_key == "conferences",
        )
    )
    if not conferences:
        db.add(
            CMSSection(
                page_key="homepage",
                section_key="conferences",
                title="Upcoming Conferences",
                subtitle="Explore upcoming international conferences and submit your work before the deadlines.",
                config_json={
                    "past_section_title": "Past Conferences",
                    "past_section_subtitle": "Browse completed conferences, archives, and proceedings.",
                },
                order_index=3,
                is_active=True,
            )
        )
    seo = db.scalar(select(CMSPage).where(CMSPage.key == "homepage_seo"))
    if not seo:
        db.add(
            CMSPage(
                key="homepage_seo",
                title="Homepage SEO",
                slug="homepage-seo",
                content_json={
                    "title": "Emerald Scholars Congress | International Academic Conferences",
                    "description": (
                        "Join international academic conferences, submit your research, and access "
                        "verified publication pathways through Emerald Scholars Congress."
                    ),
                },
                is_published=True,
            )
        )
    db.commit()


def ensure_testimonials(db) -> None:
    if db.scalars(select(Testimonial).limit(1)).first():
        return
    db.add_all(
        [
            Testimonial(
                full_name="Dr. Sarah Mitchell",
                position_title="Research Fellow",
                institution="European Institute of Technology",
                country="United Kingdom",
                testimonial_text=(
                    "The submission and verification workflow was transparent, professional, and easy to follow. "
                    "I appreciated the structured review process and clear communication."
                ),
                rating=5,
                display_priority=0,
                is_active=True,
            ),
            Testimonial(
                full_name="Prof. Ahmed Hassan",
                position_title="Associate Professor",
                institution="International School of Digital Systems",
                country="United Arab Emirates",
                testimonial_text=(
                    "A credible international platform for academic participation. The portal made it simple to "
                    "manage revisions and track conference eligibility."
                ),
                rating=5,
                display_priority=1,
                is_active=True,
            ),
            Testimonial(
                full_name="Dr. Elena Vasquez",
                position_title="Principal Investigator",
                institution="Center for Applied Research",
                country="Spain",
                testimonial_text=(
                    "Professional review, international exposure, and a trustworthy application experience. "
                    "Highly recommended for researchers seeking conference publication pathways."
                ),
                rating=5,
                display_priority=2,
                is_active=True,
            ),
        ]
    )
    db.commit()
    print("Testimonials created.")


LEGAL_PAGES = {
    "privacy-policy": {
        "title": "Privacy Policy",
        "heading": "Privacy Policy",
        "body_markdown": "## Privacy Policy\n\nWe respect your privacy and process personal data in accordance with applicable regulations.",
    },
    "academic-integrity": {
        "title": "Academic Integrity Policy",
        "heading": "Academic Integrity Policy",
        "body_markdown": "## Academic Integrity\n\nAll submissions must comply with international standards of academic honesty and integrity.",
    },
    "publication-ethics": {
        "title": "Publication Ethics Policy",
        "heading": "Publication Ethics Policy",
        "body_markdown": "## Publication Ethics\n\nWe follow ethical publication practices for conference and scholarly outputs.",
    },
    "refund-policy": {
        "title": "Refund Policy",
        "heading": "Refund Policy",
        "body_markdown": "## Refund Policy\n\nRefund eligibility depends on the event organizer and applicable payment terms.",
    },
}


def ensure_legal_pages(db) -> None:
    for slug, data in LEGAL_PAGES.items():
        if db.scalar(select(CMSPage).where(CMSPage.slug == slug)):
            continue
        db.add(
            CMSPage(
                key=slug.replace("-", "_"),
                title=data["title"],
                slug=slug,
                content_json={
                    "heading": data["heading"],
                    "body_markdown": data["body_markdown"],
                    "updated_at": "2026-05-27",
                },
                is_published=True,
            )
        )
    db.commit()


SAMPLE_EVENT_CONTENT = {
    "overview_markdown": (
        "## About the conference\n\n"
        "This international event brings together researchers, practitioners, and policymakers "
        "to share original work, discuss emerging trends, and build collaborative networks.\n\n"
        "### Objectives\n\n"
        "- Promote rigorous academic exchange\n"
        "- Support publication-ready scholarly outputs\n"
        "- Enable verified participation records"
    ),
    "important_dates": [
        {"label": "Abstract submission", "date": "2026-06-01"},
        {"label": "Full paper deadline", "date": "2026-07-15"},
        {"label": "Notification of acceptance", "date": "2026-08-01"},
        {"label": "Conference dates", "date": "2026-09-15 – 2026-09-17"},
    ],
    "topics": [
        {"title": "Artificial Intelligence", "description": "Machine learning, NLP, and intelligent systems."},
        {"title": "Sustainable Technology", "description": "Green innovation and policy."},
        {"title": "Digital Systems", "description": "Platforms, infrastructure, and security."},
    ],
    "people_groups": [
        {
            "group": "Keynote Speakers",
            "people": [
                {
                    "full_name": "Prof. Elena Richter",
                    "position": "Keynote Speaker",
                    "institution": "Berlin Institute of Technology",
                    "country": "Germany",
                    "bio": "Leading researcher in sustainable innovation and digital transformation.",
                }
            ],
        }
    ],
    "submission": {
        "guidelines_markdown": "Submit your abstract and full paper through the applicant portal. Follow the official formatting template.",
        "publication_markdown": "Accepted papers may be considered for conference proceedings and indexed publication channels.",
        "requirements": [
            "Original, unpublished work",
            "English-language submission",
            "Plagiarism check required",
        ],
    },
    "schedule": [
        {"day": "Day 1", "time": "09:00", "session": "Opening & Keynotes", "speaker": "—"},
        {"day": "Day 2", "time": "10:30", "session": "Parallel technical sessions", "speaker": "—"},
    ],
    "venue": {
        "venue_name": "Berlin Congress Center",
        "address": "Alexanderstraße 11, 10178 Berlin",
        "city": "Berlin",
        "country": "Germany",
        "maps_url": "https://maps.google.com",
        "online_platform": "Zoom (hybrid sessions)",
    },
    "quick_info": {
        "organizer": "Emerald Scholars Congress",
        "language": "English",
        "publication_type": "Conference Proceedings",
        "indexing": ["Scopus-ready workflow", "DOI assignment"],
        "certificates_available": True,
    },
    "faq": [
        {
            "question": "How do I submit my paper?",
            "answer": "Create an applicant account and complete the submission wizard in the user portal.",
        },
        {
            "question": "Is hybrid attendance supported?",
            "answer": "Yes. Select your attendance format during submission.",
        },
    ],
    "cta": {
        "title": "Ready to Submit Your Work?",
        "subtitle": "Create your account and start your application today.",
        "primary_label": "Apply Now",
        "primary_url": "/portal/signup",
    },
    "footer_cta": {
        "title": "Join Our Academic Community",
        "primary_label": "Apply Now",
        "primary_url": "/portal/signup",
    },
    "hero": {
        "primary_label": "Apply Now",
        "primary_url": "/portal/signup",
        "secondary_label": "Verify Certificate",
        "secondary_url": "/verify",
        "overlay_opacity": 0.55,
    },
}


def ensure_event_detail_content(db) -> None:
    for slug in ("global-symposium-sustainable-technology-2026", "international-conference-ai-digital-systems-2026"):
        event = db.scalar(select(Event).where(Event.slug == slug))
        if not event:
            continue
        if not event.content_json:
            event.content_json = SAMPLE_EVENT_CONTENT
        if not event.subtitle:
            event.subtitle = "International academic conference & publication pathway"
        if not event.event_type:
            event.event_type = "Conference"
        if not event.registration_deadline and event.submission_deadline:
            event.registration_deadline = event.submission_deadline
        db.commit()


def ensure_terms_page(db) -> None:
    if db.scalar(select(CMSPage).where(CMSPage.slug == "terms")):
        return
    db.add(
        CMSPage(
            key="terms",
            title="Terms & Conditions",
            slug="terms",
            content_json={
                "heading": "Terms & Conditions",
                "updated_at": "2026-05-23",
                "body_markdown": TERMS_MARKDOWN,
            },
            is_published=True,
        )
    )
    db.commit()
    print("Terms & Conditions CMS page created.")


def ensure_about_sections(db) -> None:
    if db.scalar(select(CMSSection).where(CMSSection.page_key == "about").limit(1)):
        return
    from app.services.cms_service import get_about

    defaults = get_about(db)
    sections_spec = [
        ("hero", 0, defaults["hero"].get("title"), defaults["hero"].get("subtitle"), None),
        ("mission", 1, defaults["mission"].get("title"), None, defaults["mission"].get("body")),
        ("vision", 2, defaults["vision"].get("title"), None, defaults["vision"].get("body")),
        ("why_built", 3, defaults["why_built"].get("title"), None, defaults["why_built"].get("body")),
        ("advantages", 4, defaults["advantages"].get("section_title"), defaults["advantages"].get("section_subtitle"), None),
        ("integrity", 5, defaults["integrity"].get("title"), None, defaults["integrity"].get("body")),
        ("global", 6, defaults["global_positioning"].get("title"), None, defaults["global_positioning"].get("body")),
        ("statistics", 7, defaults["statistics"].get("section_title"), None, None),
        ("timeline", 8, defaults["timeline"].get("section_title"), None, None),
        ("values", 9, defaults["values"].get("section_title"), None, None),
        ("partners", 10, defaults["partners"].get("section_title"), defaults["partners"].get("section_subtitle"), None),
        ("gallery", 11, defaults["gallery"].get("section_title"), None, None),
        ("testimonials", 12, defaults["testimonials"].get("section_title"), defaults["testimonials"].get("section_subtitle"), None),
        ("cta", 13, defaults["cta"].get("title"), defaults["cta"].get("subtitle"), None),
    ]
    config_keys = {
        "hero": "hero",
        "mission": "mission",
        "vision": "vision",
        "why_built": "why_built",
        "advantages": "advantages",
        "integrity": "integrity",
        "global": "global_positioning",
        "statistics": "statistics",
        "timeline": "timeline",
        "values": "values",
        "partners": "partners",
        "gallery": "gallery",
        "testimonials": "testimonials",
        "cta": "cta",
    }
    for section_key, order_index, title, subtitle, body in sections_spec:
        data_key = config_keys[section_key]
        section_data = defaults[data_key]
        config = {k: v for k, v in section_data.items() if k not in ("title", "subtitle", "body", "section_title", "section_subtitle")}
        db.add(
            CMSSection(
                page_key="about",
                section_key=section_key,
                title=title,
                subtitle=subtitle,
                body=body,
                config_json=config or None,
                order_index=order_index,
                is_active=True,
            )
        )
    seo = db.scalar(select(CMSPage).where(CMSPage.key == "about_seo"))
    if not seo:
        db.add(
            CMSPage(
                key="about_seo",
                title="About SEO",
                slug="about-seo",
                content_json=defaults["seo"],
                is_published=True,
            )
        )
    db.commit()
    print("About page CMS sections created.")


def ensure_contact_sections(db) -> None:
    if db.scalar(select(CMSSection).where(CMSSection.page_key == "contact").limit(1)):
        return
    from app.services.cms_service import get_contact

    defaults = get_contact(db)
    sections_spec = [
        ("hero", 0, defaults["hero"].get("title"), defaults["hero"].get("subtitle"), None),
        ("introduction", 1, defaults["introduction"].get("title"), None, defaults["introduction"].get("body")),
        ("contact_methods", 2, defaults["contact_methods"].get("section_title"), None, None),
        ("form", 3, defaults["form"].get("title"), defaults["form"].get("subtitle"), None),
        ("departments", 4, defaults["departments"].get("section_title"), None, None),
        ("office", 5, defaults["office"].get("title"), None, defaults["office"].get("body")),
        ("faq", 6, defaults["faq"].get("section_title"), None, None),
        ("partnerships", 7, defaults["partnerships"].get("title"), None, defaults["partnerships"].get("body")),
        ("social", 8, defaults["social"].get("section_title"), None, None),
        ("priority_notice", 9, defaults["priority_notice"].get("title"), None, defaults["priority_notice"].get("body")),
        ("cta", 10, defaults["cta"].get("title"), defaults["cta"].get("subtitle"), None),
    ]
    config_keys = {
        "hero": "hero",
        "introduction": "introduction",
        "contact_methods": "contact_methods",
        "form": "form",
        "departments": "departments",
        "office": "office",
        "faq": "faq",
        "partnerships": "partnerships",
        "social": "social",
        "priority_notice": "priority_notice",
        "cta": "cta",
    }
    for section_key, order_index, title, subtitle, body in sections_spec:
        data_key = config_keys[section_key]
        section_data = defaults[data_key]
        config = {
            k: v
            for k, v in section_data.items()
            if k not in ("title", "subtitle", "body", "section_title", "section_subtitle")
        }
        db.add(
            CMSSection(
                page_key="contact",
                section_key=section_key,
                title=title,
                subtitle=subtitle,
                body=body,
                config_json=config or None,
                order_index=order_index,
                is_active=True,
            )
        )
    seo = db.scalar(select(CMSPage).where(CMSPage.key == "contact_seo"))
    if not seo:
        db.add(
            CMSPage(
                key="contact_seo",
                title="Contact SEO",
                slug="contact-seo",
                content_json=defaults["seo"],
                is_published=True,
            )
        )
    db.commit()
    print("Contact page CMS sections created.")


def seed():
    db = SessionLocal()
    try:
        if db.scalar(select(User).where(User.email == "admin@emeraldscholars.org")):
            ensure_terms_page(db)
            ensure_homepage_sections(db)
            ensure_homepage_extras(db)
            ensure_hero_slides(db)
            ensure_testimonials(db)
            ensure_legal_pages(db)
            ensure_event_detail_content(db)
            ensure_about_sections(db)
            ensure_contact_sections(db)
            ensure_events_catalog(db)
            print("Seed data already exists, skipping.")
            return

        admin = User(
            id=generate_id("usr_"),
            email="admin@emeraldscholars.org",
            password_hash=hash_password("ChangeMe123!"),
            full_name="ESC Administrator",
            display_name="Administrator",
            role="admin",
            is_verified=True,
        )
        demo_user = User(
            id=generate_id("usr_"),
            email="daniel.morgan@example.com",
            password_hash=hash_password("ChangeMe123!"),
            full_name="Daniel Morgan",
            display_name="Daniel Morgan",
            role="user",
            country="United States",
            affiliation="Example Research Institute",
            is_verified=True,
        )
        db.add_all([admin, demo_user])
        db.flush()

        past_event = Event(
            id=generate_id("evt_"),
            title="International Conference on Artificial Intelligence and Digital Systems 2026",
            slug="international-conference-ai-digital-systems-2026",
            event_code="ESC-EVT-2026-AI",
            category="Conference",
            location="Dubai, United Arab Emirates",
            country="United Arab Emirates",
            format="Hybrid",
            start_date=date(2026, 3, 10),
            end_date=date(2026, 3, 12),
            submission_deadline=date(2026, 2, 1),
            status="Completed",
            short_description="A premier international forum on AI, digital systems, and scholarly innovation.",
            overview="A premier international forum on artificial intelligence, digital systems, and scholarly innovation.",
            is_public=True,
        )
        upcoming_event = Event(
            id=generate_id("evt_"),
            title="Global Symposium on Sustainable Technology and Innovation 2026",
            slug="global-symposium-sustainable-technology-2026",
            event_code="ESC-EVT-2026-ST",
            category="Symposium",
            location="Berlin, Germany",
            country="Germany",
            format="Hybrid",
            start_date=date(2026, 9, 15),
            end_date=date(2026, 9, 17),
            submission_deadline=date(2026, 8, 1),
            status="Submission Open",
            short_description="International symposium on sustainable technology, innovation policy, and applied research.",
            overview="Join scholars and practitioners exploring sustainable technology pathways and innovation policy.",
            is_public=True,
        )
        db.add_all([past_event, upcoming_event])
        db.flush()
        event = past_event

        submission = Submission(
            id=generate_id("sub_"),
            submission_code="ESC-SUB-2026-001",
            user_id=demo_user.id,
            event_id=event.id,
            title="Human-Centered Applications of AI Assistants in Digital Workflows",
            abstract="This study examines practical deployments of AI assistants in academic and professional workflows.",
            keywords="AI, digital workflows, human-centered design",
            participation_type="Oral Presentation",
            attendance_format="In-person",
            status="certificate_issued",
            certificate_name="Daniel Morgan",
            certificate_role="Presenter",
        )
        db.add(submission)
        db.flush()

        certificate = Certificate(
            id=generate_id("cert_"),
            certificate_code="ESC-2026-AI-001",
            user_id=demo_user.id,
            submission_id=submission.id,
            event_id=event.id,
            holder_name="Daniel Morgan",
            event_title_snapshot=event.title,
            event_date_snapshot="March 10–12, 2026",
            location_snapshot=event.location,
            role="Presenter",
            record_type="Conference Participation Certificate",
            presentation_title="Human-Centered Applications of AI Assistants in Digital Workflows",
            issue_date=date(2026, 3, 15),
            status="verified",
            verification_message="This certificate has been verified by Emerald Scholars Congress.",
        )
        db.add(certificate)

        db.add(
            Message(
                user_id=demo_user.id,
                title="Certificate Issued",
                body="Your certificate ESC-2026-AI-001 has been issued and is available for verification.",
                type="notification",
            )
        )

        # CMS homepage sections
        sections = [
            CMSSection(
                page_key="homepage",
                section_key="hero",
                title="Join Our International Academic Conference",
                subtitle=(
                    "Create your applicant account, submit your academic materials, and complete the "
                    "verification process to become eligible for conference participation and publication."
                ),
                config_json={
                    "primary_cta_label": "Apply Now",
                    "primary_cta_url": "/portal/signup",
                },
                order_index=0,
            ),
            CMSSection(
                page_key="homepage",
                section_key="services",
                title="Our Services",
                subtitle="You are only three steps away from our conference.",
                config_json={
                    "steps": [
                        {
                            "step": 1,
                            "title": "Submit Your Work",
                            "description": (
                                "Create your account and upload your academic documents, research paper, abstract, "
                                "and required information."
                            ),
                        },
                        {
                            "step": 2,
                            "title": "Eligibility Review & Revision",
                            "description": (
                                "Our team reviews your documents and submission. If corrections or additional materials "
                                "are needed, you will be notified through your portal."
                            ),
                        },
                        {
                            "step": 3,
                            "title": "Approval for Publication",
                            "description": (
                                "After successful verification and academic approval, your submission becomes eligible "
                                "for official conference participation and publication."
                            ),
                        },
                    ]
                },
                order_index=1,
            ),
            CMSSection(
                page_key="homepage",
                section_key="advantages",
                title="Why Join Our Conference Platform",
                subtitle=(
                    "Professional academic verification, international publication opportunities, "
                    "and a streamlined submission process."
                ),
                config_json={"cards": ADVANTAGE_CARDS},
                order_index=2,
            ),
            CMSSection(
                page_key="homepage",
                section_key="conferences",
                title="Upcoming Conferences",
                subtitle="Explore upcoming international conferences and submit your work before the deadlines.",
                config_json={
                    "past_section_title": "Past Conferences",
                    "past_section_subtitle": "Browse completed conferences, archives, and proceedings.",
                },
                order_index=3,
            ),
        ]
        db.add_all(sections)

        db.add_all(
            [
                HeroCarouselSlide(
                    title="Join Our International Academic Conference",
                    subtitle="Submit your academic work and become eligible for international publication.",
                    description=(
                        "Create your applicant account, complete verification, and join leading scholars "
                        "through our official conference platform."
                    ),
                    cta_label="Apply Now",
                    cta_url="/portal/signup",
                    cta_type="internal",
                    display_priority=0,
                    is_active=True,
                ),
                HeroCarouselSlide(
                    title="International Publication Pathways",
                    subtitle="Professional review, secure submissions, and verified academic credentials.",
                    description="Discover upcoming conferences and submit your research through a trusted scholarly workflow.",
                    cta_label="Start Your Application",
                    cta_url="/portal/signup",
                    cta_type="internal",
                    display_priority=1,
                    is_active=True,
                ),
            ]
        )

        pages = [
            CMSPage(
                key="about",
                title="About",
                slug="about",
                content_json={
                    "heading": "About Emerald Scholars Congress",
                    "body": "Emerald Scholars Congress is an international platform for academic events, scholarly submissions, and verified participation credentials.",
                },
                is_published=True,
            ),
            CMSPage(
                key="contact",
                title="Contact",
                slug="contact",
                content_json={
                    "heading": "Contact Us",
                    "email": "contact@emeraldscholars.org",
                    "body": "For general inquiries, please reach out to our support team.",
                },
                is_published=True,
            ),
            CMSPage(
                key="terms",
                title="Terms & Conditions",
                slug="terms",
                content_json={
                    "heading": "Terms & Conditions",
                    "updated_at": "2026-05-23",
                    "body_markdown": TERMS_MARKDOWN,
                },
                is_published=True,
            ),
            CMSPage(
                key="navigation",
                title="Navigation",
                slug="navigation",
                content_json={
                    "items": [
                        {"label": "Home", "href": "/"},
                        {"label": "Conferences", "href": "/conferences"},
                        {"label": "Verify", "href": "/verify"},
                        {"label": "About", "href": "/about"},
                        {"label": "Contact", "href": "/contact"},
                        {"label": "Terms", "href": "/terms"},
                    ]
                },
                is_published=True,
            ),
            CMSPage(
                key="footer",
                title="Footer",
                slug="footer",
                content_json={
                    "organization": "Emerald Scholars Congress",
                    "tagline": "International academic events and credential verification",
                    "copyright": "© Emerald Scholars Congress. All rights reserved.",
                },
                is_published=True,
            ),
            CMSPage(
                key="homepage_seo",
                title="Homepage SEO",
                slug="homepage-seo",
                content_json={
                    "title": "Emerald Scholars Congress | International Academic Conferences",
                    "description": (
                        "Join international academic conferences, submit your research, and access "
                        "verified publication pathways through Emerald Scholars Congress."
                    ),
                },
                is_published=True,
            ),
        ]
        db.add_all(pages)
        db.commit()
        print("Seed data created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
