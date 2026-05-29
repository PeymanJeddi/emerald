"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-05-23

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("display_name", sa.String(255)),
        sa.Column("role", sa.String(20), nullable=False, server_default="user"),
        sa.Column("country", sa.String(100)),
        sa.Column("city", sa.String(100)),
        sa.Column("affiliation", sa.String(255)),
        sa.Column("department", sa.String(255)),
        sa.Column("professional_role", sa.String(100)),
        sa.Column("bio", sa.Text()),
        sa.Column("profile_photo_url", sa.String(500)),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("is_verified", sa.Boolean(), server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True)),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "events",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("slug", sa.String(200), nullable=False, unique=True),
        sa.Column("event_code", sa.String(50), nullable=False, unique=True),
        sa.Column("category", sa.String(100)),
        sa.Column("location", sa.String(255)),
        sa.Column("format", sa.String(50)),
        sa.Column("start_date", sa.Date()),
        sa.Column("end_date", sa.Date()),
        sa.Column("status", sa.String(50)),
        sa.Column("overview", sa.Text()),
        sa.Column("is_public", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True)),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "submissions",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("submission_code", sa.String(50), nullable=False, unique=True),
        sa.Column("user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("event_id", sa.String(32), sa.ForeignKey("events.id"), nullable=False),
        sa.Column("title", sa.String(500)),
        sa.Column("abstract", sa.Text()),
        sa.Column("keywords", sa.String(500)),
        sa.Column("participation_type", sa.String(100)),
        sa.Column("attendance_format", sa.String(50)),
        sa.Column("status", sa.String(50)),
        sa.Column("certificate_name", sa.String(255)),
        sa.Column("certificate_role", sa.String(100)),
        sa.Column("notes", sa.Text()),
        sa.Column("submitted_at", sa.DateTime(timezone=True)),
        sa.Column("last_updated_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "submission_files",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("submission_id", sa.String(32), sa.ForeignKey("submissions.id"), nullable=False),
        sa.Column("file_type", sa.String(50), nullable=False),
        sa.Column("original_filename", sa.String(500), nullable=False),
        sa.Column("storage_path", sa.String(1000), nullable=False),
        sa.Column("mime_type", sa.String(100)),
        sa.Column("size_bytes", sa.BigInteger()),
        sa.Column("uploaded_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "certificates",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("certificate_code", sa.String(50), nullable=False, unique=True),
        sa.Column("user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("submission_id", sa.String(32), sa.ForeignKey("submissions.id")),
        sa.Column("event_id", sa.String(32), sa.ForeignKey("events.id")),
        sa.Column("holder_name", sa.String(255), nullable=False),
        sa.Column("event_title_snapshot", sa.String(500)),
        sa.Column("event_date_snapshot", sa.String(100)),
        sa.Column("location_snapshot", sa.String(255)),
        sa.Column("role", sa.String(100)),
        sa.Column("record_type", sa.String(200)),
        sa.Column("presentation_title", sa.String(500)),
        sa.Column("issue_date", sa.Date()),
        sa.Column("status", sa.String(20)),
        sa.Column("verification_message", sa.Text()),
        sa.Column("revoked_at", sa.DateTime(timezone=True)),
        sa.Column("revoke_reason", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "payments",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("submission_id", sa.String(32), sa.ForeignKey("submissions.id")),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(10)),
        sa.Column("method", sa.String(50)),
        sa.Column("status", sa.String(30)),
        sa.Column("payment_reference", sa.String(200)),
        sa.Column("receipt_file_url", sa.String(500)),
        sa.Column("admin_note", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True)),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "cms_pages",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("key", sa.String(100), nullable=False, unique=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("slug", sa.String(200), nullable=False, unique=True),
        sa.Column("content_json", postgresql.JSONB()),
        sa.Column("seo_title", sa.String(255)),
        sa.Column("seo_description", sa.String(500)),
        sa.Column("is_published", sa.Boolean(), server_default="true"),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "cms_sections",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("page_key", sa.String(100), nullable=False),
        sa.Column("section_key", sa.String(100), nullable=False),
        sa.Column("title", sa.String(500)),
        sa.Column("subtitle", sa.String(500)),
        sa.Column("body", sa.Text()),
        sa.Column("config_json", postgresql.JSONB()),
        sa.Column("order_index", sa.Integer(), server_default="0"),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
    )

    op.create_table(
        "messages",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("type", sa.String(50)),
        sa.Column("is_read", sa.Boolean(), server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("actor_user_id", sa.String(32), sa.ForeignKey("users.id")),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("entity_type", sa.String(100)),
        sa.Column("entity_id", sa.String(32)),
        sa.Column("metadata_json", postgresql.JSONB()),
        sa.Column("created_at", sa.DateTime(timezone=True)),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("messages")
    op.drop_table("cms_sections")
    op.drop_table("cms_pages")
    op.drop_table("payments")
    op.drop_table("certificates")
    op.drop_table("submission_files")
    op.drop_table("submissions")
    op.drop_table("events")
    op.drop_table("users")
