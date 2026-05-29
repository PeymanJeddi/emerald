"""event detail extended fields and content_json

Revision ID: 004
Revises: 003
Create Date: 2026-05-27

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("events", sa.Column("subtitle", sa.String(500)))
    op.add_column("events", sa.Column("event_type", sa.String(50)))
    op.add_column("events", sa.Column("hero_image_url", sa.String(500)))
    op.add_column("events", sa.Column("hero_video_url", sa.String(500)))
    op.add_column("events", sa.Column("video_thumbnail_url", sa.String(500)))
    op.add_column("events", sa.Column("registration_deadline", sa.Date()))
    op.add_column("events", sa.Column("content_json", postgresql.JSONB()))
    op.add_column("events", sa.Column("seo_title", sa.String(255)))
    op.add_column("events", sa.Column("seo_description", sa.String(500)))
    op.add_column("events", sa.Column("og_image_url", sa.String(500)))
    op.add_column("events", sa.Column("is_featured", sa.Boolean(), server_default="false"))
    op.add_column("events", sa.Column("display_priority", sa.Integer(), server_default="0"))


def downgrade() -> None:
    op.drop_column("events", "display_priority")
    op.drop_column("events", "is_featured")
    op.drop_column("events", "og_image_url")
    op.drop_column("events", "seo_description")
    op.drop_column("events", "seo_title")
    op.drop_column("events", "content_json")
    op.drop_column("events", "registration_deadline")
    op.drop_column("events", "video_thumbnail_url")
    op.drop_column("events", "hero_video_url")
    op.drop_column("events", "hero_image_url")
    op.drop_column("events", "event_type")
    op.drop_column("events", "subtitle")
