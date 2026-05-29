from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cms import CMSPage, CMSSection
from app.schemas.cms import CMSSectionCreate, CMSSectionUpdate, CMSPageCreate, CMSPageUpdate


def get_homepage(db: Session) -> dict:
    sections = list(
        db.scalars(
            select(CMSSection)
            .where(CMSSection.page_key == "homepage", CMSSection.is_active == True)  # noqa: E712
            .order_by(CMSSection.order_index)
        ).all()
    )
    by_key = {s.section_key: s for s in sections}

    def section_dict(key: str, defaults: dict) -> dict:
        s = by_key.get(key)
        if not s:
            return defaults
        result = {**defaults}
        if s.title:
            result["title"] = s.title
        if s.subtitle:
            result["subtitle"] = s.subtitle
        if s.body:
            result["body"] = s.body
        if s.config_json:
            result.update(s.config_json)
        return result

    hero = section_dict(
        "hero",
        {
            "title": "Join Our International Academic Conference",
            "subtitle": (
                "Create your applicant account, submit your academic materials, and complete the "
                "verification process to become eligible for conference participation and publication."
            ),
            "primary_cta_label": "Apply Now",
            "primary_cta_url": "/portal/signup",
        },
    )
    default_steps = [
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
    services_section = by_key.get("services")
    features_section = by_key.get("features")
    services = {
        "section_title": "Our Services",
        "section_subtitle": "You are only three steps away from our conference.",
        "steps": default_steps,
    }
    if services_section:
        if services_section.title:
            services["section_title"] = services_section.title
        if services_section.subtitle:
            services["section_subtitle"] = services_section.subtitle
        if services_section.config_json:
            services.update(services_section.config_json)
    elif features_section:
        if features_section.title:
            services["section_title"] = features_section.title
        if features_section.subtitle:
            services["section_subtitle"] = features_section.subtitle
        cards = (
            features_section.config_json.get("cards", default_steps)
            if features_section.config_json
            else default_steps
        )
        services["steps"] = cards
    features = services["steps"]
    institutional = section_dict(
        "institutional",
        {
            "title": "Institutional Commitment",
            "body": "Emerald Scholars Congress supports transparent academic participation records and secure credential verification.",
        },
    )
    verification = section_dict(
        "verification",
        {
            "title": "Certificate Verification",
            "body": "Enter your certificate code to confirm authenticity.",
            "input_placeholder": "e.g. ESC-2026-AI-001",
        },
    )
    default_advantages = [
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
    advantages_section = by_key.get("advantages")
    advantages = {
        "section_title": "Why Join Our Conference Platform",
        "section_subtitle": (
            "Professional academic verification, international publication opportunities, "
            "and a streamlined submission process."
        ),
        "cards": default_advantages,
    }
    if advantages_section:
        if advantages_section.title:
            advantages["section_title"] = advantages_section.title
        if advantages_section.subtitle:
            advantages["section_subtitle"] = advantages_section.subtitle
        if advantages_section.config_json and advantages_section.config_json.get("cards"):
            advantages["cards"] = advantages_section.config_json["cards"]

    conferences_section = section_dict(
        "conferences",
        {
            "section_title": "Upcoming Conferences",
            "section_subtitle": (
                "The nearest upcoming conferences currently open or approaching registration and submission deadlines."
            ),
            "past_section_title": "Past Conferences",
            "past_section_subtitle": "Browse completed conferences, archives, and proceedings.",
        },
    )

    testimonials_section = section_dict(
        "testimonials",
        {
            "section_title": "What Participants Say",
            "section_subtitle": "Feedback from researchers, participants, reviewers, and academic contributors.",
        },
    )

    apply_cta = section_dict(
        "apply_cta",
        {
            "title": "Ready to Join Our Conference?",
            "subtitle": (
                "Create your applicant account, submit your academic materials, and begin your conference journey today."
            ),
            "primary_label": "Apply Now",
            "primary_url": "/portal/signup",
            "secondary_label": "Explore Events",
            "secondary_url": "/events",
        },
    )

    events_section = section_dict(
        "events",
        {
            "section_title": "Events",
            "section_subtitle": "Browse upcoming and past conferences, academic events, and publication opportunities.",
        },
    )

    seo_page = db.scalar(select(CMSPage).where(CMSPage.key == "homepage_seo"))
    seo = {
        "title": "Emerald Scholars Congress",
        "description": "International academic conferences, applicant submissions, and verified publication pathways.",
        "og_image": None,
    }
    if seo_page and seo_page.content_json:
        seo.update({k: v for k, v in seo_page.content_json.items() if v})

    return {
        "hero": hero,
        "features": {
            "section_title": services["section_title"],
            "section_subtitle": services["section_subtitle"],
            "cards": features,
        },
        "services": services,
        "advantages": advantages,
        "conferences": conferences_section,
        "testimonials": testimonials_section,
        "apply_cta": apply_cta,
        "events": events_section,
        "seo": seo,
        "institutional": institutional,
        "verification": verification,
    }


def get_about(db: Session) -> dict:
    sections = list(
        db.scalars(
            select(CMSSection)
            .where(CMSSection.page_key == "about", CMSSection.is_active == True)  # noqa: E712
            .order_by(CMSSection.order_index)
        ).all()
    )
    by_key = {s.section_key: s for s in sections}

    def section_dict(key: str, defaults: dict) -> dict:
        s = by_key.get(key)
        if not s:
            return defaults
        result = {**defaults}
        if s.title:
            result["title"] = s.title
        if s.subtitle:
            result["subtitle"] = s.subtitle
        if s.body:
            result["body"] = s.body
        if s.config_json:
            result.update(s.config_json)
        return result

    hero = section_dict(
        "hero",
        {
            "label": "International Academic Conference Platform",
            "title": "Building a Trusted Global Platform for Academic Conferences, Publications, and Research Collaboration",
            "subtitle": (
                "We help researchers, students, professionals, and institutions connect through modern "
                "conference infrastructure, academic verification, and international publication opportunities."
            ),
            "primary_cta_label": "Explore Events",
            "primary_cta_url": "/events",
            "secondary_cta_label": "Apply Now",
            "secondary_cta_url": "/portal/signup",
        },
    )
    mission = section_dict(
        "mission",
        {
            "title": "Our Mission",
            "body": (
                "Our mission is to create a modern, secure, and internationally accessible academic conference "
                "ecosystem that supports researchers, institutions, and professionals through transparent submission "
                "workflows, academic integrity standards, publication opportunities, and streamlined digital participation.\n\n"
                "We aim to reduce barriers between researchers and global academic opportunities by providing a trusted "
                "platform for conferences, collaboration, and scholarly visibility."
            ),
        },
    )
    vision = section_dict(
        "vision",
        {
            "title": "Our Vision",
            "body": (
                "We envision a globally connected academic ecosystem where conferences, publications, research "
                "collaboration, and institutional participation become more accessible, transparent, and technologically advanced.\n\n"
                "Our long-term vision is to become a trusted international infrastructure for academic events, "
                "publication management, verification systems, and scientific networking."
            ),
        },
    )
    why_built = section_dict(
        "why_built",
        {
            "title": "Why We Built This Platform",
            "body": (
                "Academic conferences and publication systems often suffer from fragmented workflows, outdated "
                "infrastructure, poor communication, and limited transparency."
            ),
            "bullets": [
                "Structured submission workflows",
                "Centralized applicant management",
                "Modern verification systems",
                "Publication support",
                "Transparent review processes",
                "Secure digital participation",
                "Scalable international conference infrastructure",
            ],
            "closing": (
                "Our goal is to simplify participation while maintaining high academic and ethical standards."
            ),
        },
    )
    advantages = section_dict(
        "advantages",
        {
            "section_title": "Platform Advantages",
            "section_subtitle": "Modern infrastructure designed for international academic participation.",
            "cards": [
                {
                    "title": "Academic Verification",
                    "description": "Structured review and integrity-focused verification systems.",
                },
                {
                    "title": "International Participation",
                    "description": "Support for global applicants, conferences, and institutions.",
                },
                {
                    "title": "Secure Applicant Portal",
                    "description": "Centralized submission and revision management.",
                },
                {
                    "title": "Publication Workflow",
                    "description": "Support for publication pipelines, proceedings, and indexing workflows.",
                },
                {
                    "title": "Conference Management Infrastructure",
                    "description": "Modern digital systems for event organization and participation.",
                },
                {
                    "title": "Scalable Digital Experience",
                    "description": "Designed for future hybrid, online, and international conference ecosystems.",
                },
            ],
        },
    )
    integrity = section_dict(
        "integrity",
        {
            "title": "Academic Integrity & Verification",
            "body": (
                "Academic integrity is one of the core principles of our platform. We implement structured "
                "verification workflows and integrity-focused review systems designed to support transparency, "
                "authenticity, and ethical academic participation."
            ),
            "bullets": [
                "Submission validation",
                "Document verification",
                "Originality checks",
                "Publication integrity review",
                "Plagiarism screening",
                "Institutional confirmation workflows",
                "Fraud prevention mechanisms",
            ],
            "closing": (
                "We continuously work toward maintaining a secure and trustworthy academic environment for "
                "researchers, institutions, and organizers."
            ),
        },
    )
    global_positioning = section_dict(
        "global",
        {
            "title": "Designed for International Academic Participation",
            "body": (
                "Our platform is built to support researchers, institutions, and conference organizers from "
                "different countries and academic backgrounds."
            ),
            "bullets": [
                "International conferences",
                "Cross-border collaboration",
                "Multilingual participation",
                "Digital academic workflows",
                "Scalable publication infrastructure",
            ],
        },
    )
    statistics = section_dict(
        "statistics",
        {
            "section_title": "Our Impact in Numbers",
            "items": [
                {"value": 120, "suffix": "+", "label": "Conferences Hosted"},
                {"value": 8500, "suffix": "+", "label": "Researchers Supported"},
                {"value": 70, "suffix": "+", "label": "Institutions Connected"},
                {"value": 35, "suffix": "+", "label": "Countries Represented"},
                {"value": 2400, "suffix": "+", "label": "Published Papers"},
            ],
        },
    )
    timeline = section_dict(
        "timeline",
        {
            "section_title": "Our Journey",
            "items": [
                {"year": "2023", "title": "Platform concept started", "description": "Research and architecture for a modern academic events platform."},
                {"year": "2024", "title": "First conference launched", "description": "Initial international conference workflows and applicant portal."},
                {"year": "2025", "title": "International partnerships expanded", "description": "Growing institutional collaboration and global participation."},
                {"year": "2026", "title": "Publication and verification scaled", "description": "Expanded publication pathways and certificate verification systems."},
            ],
        },
    )
    values = section_dict(
        "values",
        {
            "section_title": "Our Core Values",
            "cards": [
                {"title": "Academic Integrity", "description": "We prioritize authenticity, ethics, and responsible academic participation."},
                {"title": "Accessibility", "description": "We believe academic opportunities should be more accessible globally."},
                {"title": "Transparency", "description": "We support clear and transparent workflows."},
                {"title": "Innovation", "description": "We continuously improve academic participation through technology."},
                {"title": "Professionalism", "description": "We maintain international-quality standards in conference and publication workflows."},
            ],
        },
    )
    partners = section_dict(
        "partners",
        {
            "section_title": "Institutional & Academic Partners",
            "section_subtitle": "Collaborating with universities, research groups, and conference organizers worldwide.",
            "names": [
                "Berlin Institute of Technology",
                "Gulf Research Consortium",
                "Nordic Digital Systems Lab",
                "Asia-Pacific Scholars Network",
                "Mediterranean Academic Forum",
                "Global Innovation Institute",
            ],
        },
    )
    gallery = section_dict(
        "gallery",
        {
            "section_title": "Academic Events & Community",
            "items": [
                {"caption": "Keynote sessions", "tone": "emerald"},
                {"caption": "Research panels", "tone": "gold"},
                {"caption": "Networking moments", "tone": "ivory"},
                {"caption": "Workshop collaboration", "tone": "emerald"},
                {"caption": "Publication milestones", "tone": "gold"},
                {"caption": "International delegates", "tone": "emerald"},
            ],
        },
    )
    testimonials_section = section_dict(
        "testimonials",
        {
            "section_title": "What Participants Say",
            "section_subtitle": "Researchers and professionals share their experience with our platform.",
        },
    )
    cta = section_dict(
        "cta",
        {
            "title": "Ready to Join Our Academic Community?",
            "subtitle": (
                "Explore upcoming conferences, submit your work, and participate in our growing international "
                "academic ecosystem."
            ),
            "primary_label": "Explore Events",
            "primary_url": "/events",
            "secondary_label": "Apply Now",
            "secondary_url": "/portal/signup",
        },
    )
    seo_page = db.scalar(select(CMSPage).where(CMSPage.key == "about_seo"))
    seo = {
        "title": "About Us | Emerald Scholars Congress",
        "description": (
            "Learn about Emerald Scholars Congress — an international academic conference platform for "
            "publications, verification, and global research collaboration."
        ),
        "og_image": None,
    }
    if seo_page and seo_page.content_json:
        seo.update({k: v for k, v in seo_page.content_json.items() if v})

    return {
        "hero": hero,
        "mission": mission,
        "vision": vision,
        "why_built": why_built,
        "advantages": advantages,
        "integrity": integrity,
        "global_positioning": global_positioning,
        "statistics": statistics,
        "timeline": timeline,
        "values": values,
        "partners": partners,
        "gallery": gallery,
        "testimonials": testimonials_section,
        "cta": cta,
        "seo": seo,
    }


def get_contact(db: Session) -> dict:
    sections = list(
        db.scalars(
            select(CMSSection)
            .where(CMSSection.page_key == "contact", CMSSection.is_active == True)  # noqa: E712
            .order_by(CMSSection.order_index)
        ).all()
    )
    by_key = {s.section_key: s for s in sections}

    def section_dict(key: str, defaults: dict) -> dict:
        s = by_key.get(key)
        if not s:
            return defaults
        result = {**defaults}
        if s.title:
            result["title"] = s.title
        if s.subtitle:
            result["subtitle"] = s.subtitle
        if s.body:
            result["body"] = s.body
        if s.config_json:
            result.update(s.config_json)
        return result

    hero = section_dict(
        "hero",
        {
            "label": "Contact & Support",
            "title": "We're Here to Support Your Academic Journey",
            "subtitle": (
                "Reach out to our team for conference inquiries, publication support, academic partnerships, "
                "technical assistance, or participation guidance."
            ),
            "primary_cta_label": "Contact Support",
            "primary_cta_url": "#contact-form",
            "secondary_cta_label": "Explore Events",
            "secondary_cta_url": "/events",
        },
    )
    introduction = section_dict(
        "introduction",
        {
            "title": "How Can We Help You?",
            "body": (
                "Our team is available to assist researchers, institutions, conference participants, reviewers, "
                "sponsors, and academic partners through every stage of the conference and publication process.\n\n"
                "Whether you need technical assistance, submission guidance, verification support, publication "
                "information, or institutional collaboration, we are ready to help."
            ),
        },
    )
    contact_methods = section_dict(
        "contact_methods",
        {
            "section_title": "Contact Channels",
            "cards": [
                {
                    "title": "General Support",
                    "description": "Questions about the platform, account access, navigation, or general assistance.",
                    "email": "support@emeraldscholarscongress.org",
                    "availability": "Mon–Fri, 09:00–18:00 UTC",
                    "response": "Within 1–2 business days",
                },
                {
                    "title": "Conference & Submission Support",
                    "description": "Help with event registration, submissions, deadlines, and conference participation.",
                    "email": "conferences@emeraldscholarscongress.org",
                    "availability": "Mon–Fri, 09:00–18:00 UTC",
                    "response": "Within 1–2 business days",
                },
                {
                    "title": "Publication & Proceedings",
                    "description": "Questions related to publication workflows, proceedings, indexing, or templates.",
                    "email": "publications@emeraldscholarscongress.org",
                    "availability": "Mon–Fri, 10:00–17:00 UTC",
                    "response": "Within 2–3 business days",
                },
                {
                    "title": "Verification & Academic Integrity",
                    "description": "Document verification, integrity review, and academic compliance assistance.",
                    "email": "integrity@emeraldscholarscongress.org",
                    "availability": "Mon–Fri, 09:00–17:00 UTC",
                    "response": "Within 2 business days",
                },
                {
                    "title": "Institutional Partnerships",
                    "description": "Collaboration opportunities for universities, organizations, and institutions.",
                    "email": "partnerships@emeraldscholarscongress.org",
                    "availability": "By appointment",
                    "response": "Within 3–5 business days",
                },
                {
                    "title": "Technical Support",
                    "description": "Platform issues, login problems, upload errors, or technical troubleshooting.",
                    "email": "tech@emeraldscholarscongress.org",
                    "availability": "Mon–Sun, 08:00–20:00 UTC",
                    "response": "Within 24 hours",
                },
            ],
        },
    )
    form = section_dict(
        "form",
        {
            "title": "Send Us a Message",
            "subtitle": "Complete the form below and our team will route your inquiry to the appropriate department.",
            "support_note": (
                "For account access, use the applicant portal sign-in page. For certificate verification, "
                "visit the public verification page with your issued certificate code."
            ),
            "privacy_url": "/legal/privacy-policy",
        },
    )
    departments = section_dict(
        "departments",
        {
            "section_title": "Find the Right Department",
            "items": [
                {"name": "Academic Affairs", "description": "Academic and conference-related matters"},
                {"name": "Publications Team", "description": "Proceedings and publication workflows"},
                {"name": "Verification Team", "description": "Verification and integrity reviews"},
                {"name": "Technical Team", "description": "Platform infrastructure and technical issues"},
                {"name": "Partnerships Team", "description": "Institutional collaborations"},
                {"name": "Media & Communications", "description": "Public relations and media requests"},
            ],
        },
    )
    office = section_dict(
        "office",
        {
            "title": "Our Office & Communication Center",
            "body": (
                "Our operational and support teams coordinate conference activities, publication workflows, "
                "and participant support through our centralized communication infrastructure."
            ),
            "office_name": "Emerald Scholars Congress — Global Operations",
            "address": "International Academic Events & Verification Services",
            "city": "Berlin",
            "country": "Germany",
            "postal_code": "10178",
            "maps_url": "https://maps.google.com",
            "hours": "Monday–Friday, 09:00–18:00 UTC",
        },
    )
    faq = section_dict(
        "faq",
        {
            "section_title": "Quick Help",
            "items": [
                {
                    "question": "How do I submit my paper?",
                    "answer": "Create an applicant account in the user portal, select your target conference, and complete the submission wizard with required documents.",
                },
                {
                    "question": "How can I apply for a conference?",
                    "answer": "Browse upcoming events on the public site, then register through the applicant portal to begin your submission.",
                },
                {
                    "question": "How long does verification take?",
                    "answer": "Verification timelines vary by workflow stage. Most administrative reviews are completed within a few business days after document submission.",
                },
                {
                    "question": "Can I edit my submission after submission?",
                    "answer": "Edits are permitted when your submission status is draft or revision requested. Otherwise, contact conference support.",
                },
                {
                    "question": "How do publication approvals work?",
                    "answer": "Eligible submissions may proceed through academic review and publication pathways as defined by each conference's publication policy.",
                },
                {
                    "question": "How can institutions collaborate with the platform?",
                    "answer": "Contact our partnerships team for institutional collaboration, hosting, or sponsorship opportunities.",
                },
            ],
        },
    )
    partnerships = section_dict(
        "partnerships",
        {
            "title": "Academic & Institutional Collaboration",
            "body": (
                "We welcome collaboration opportunities with universities, academic institutions, research centers, "
                "publishers, conference organizers, scientific communities, and educational organizations."
            ),
            "cta_label": "Contact Partnerships Team",
            "cta_email": "partnerships@emeraldscholarscongress.org",
        },
    )
    social = section_dict(
        "social",
        {
            "section_title": "Connect With Us",
            "links": [
                {"platform": "LinkedIn", "url": "https://linkedin.com", "label": "LinkedIn"},
                {"platform": "X", "url": "https://x.com", "label": "X / Twitter"},
                {"platform": "ResearchGate", "url": "https://researchgate.net", "label": "ResearchGate"},
                {"platform": "YouTube", "url": "https://youtube.com", "label": "YouTube"},
            ],
        },
    )
    priority_notice = section_dict(
        "priority_notice",
        {
            "title": "Priority & Time-Sensitive Requests",
            "body": (
                "For urgent conference deadlines, submission issues, verification concerns, or publication-related "
                "emergencies, please clearly indicate the urgency level in your inquiry subject line. Our support "
                "team prioritizes time-sensitive academic and publication workflows whenever possible."
            ),
        },
    )
    cta = section_dict(
        "cta",
        {
            "title": "Ready to Participate in Our Upcoming Conferences?",
            "subtitle": (
                "Explore academic events, submit your research, and become part of our growing international "
                "academic community."
            ),
            "primary_label": "Explore Events",
            "primary_url": "/events",
            "secondary_label": "Apply Now",
            "secondary_url": "/portal/signup",
        },
    )
    seo_page = db.scalar(select(CMSPage).where(CMSPage.key == "contact_seo"))
    seo = {
        "title": "Contact Us | Emerald Scholars Congress",
        "description": (
            "Contact Emerald Scholars Congress for conference support, publication inquiries, verification, "
            "partnerships, and technical assistance."
        ),
        "og_image": None,
    }
    if seo_page and seo_page.content_json:
        seo.update({k: v for k, v in seo_page.content_json.items() if v})

    return {
        "hero": hero,
        "introduction": introduction,
        "contact_methods": contact_methods,
        "form": form,
        "departments": departments,
        "office": office,
        "faq": faq,
        "partnerships": partnerships,
        "social": social,
        "priority_notice": priority_notice,
        "cta": cta,
        "seo": seo,
    }


def get_page_by_slug(db: Session, slug: str) -> CMSPage | None:
    return db.scalar(select(CMSPage).where(CMSPage.slug == slug, CMSPage.is_published == True))  # noqa: E712


def get_navigation(db: Session) -> list[dict]:
    page = db.scalar(select(CMSPage).where(CMSPage.key == "navigation"))
    if page and page.content_json:
        return page.content_json.get("items", [])
    return [
        {"label": "Home", "href": "/"},
        {"label": "Conferences", "href": "/conferences"},
        {"label": "Verify", "href": "/verify"},
        {"label": "About", "href": "/about"},
        {"label": "Contact", "href": "/contact"},
    ]


def get_footer(db: Session) -> dict:
    page = db.scalar(select(CMSPage).where(CMSPage.key == "footer"))
    if page and page.content_json:
        return page.content_json
    return {
        "organization": "Emerald Scholars Congress",
        "tagline": "International academic events and credential verification",
        "copyright": "© Emerald Scholars Congress. All rights reserved.",
    }


def create_page(db: Session, data: CMSPageCreate) -> CMSPage:
    page = CMSPage(**data.model_dump())
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


def update_page(db: Session, page: CMSPage, data: CMSPageUpdate) -> CMSPage:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(page, field, value)
    db.commit()
    db.refresh(page)
    return page


def create_section(db: Session, data: CMSSectionCreate) -> CMSSection:
    section = CMSSection(**data.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


def update_section(db: Session, section: CMSSection, data: CMSSectionUpdate) -> CMSSection:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(section, field, value)
    db.commit()
    db.refresh(section)
    return section
