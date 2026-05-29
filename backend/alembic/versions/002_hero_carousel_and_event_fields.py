"""hero carousel and event extended fields

Revision ID: 002
Revises: 001
Create Date: 2026-05-23

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "hero_carousel_slides",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("subtitle", sa.String(500)),
        sa.Column("description", sa.Text()),
        sa.Column("background_image_url", sa.String(500)),
        sa.Column("cta_label", sa.String(120)),
        sa.Column("cta_url", sa.String(500)),
        sa.Column("cta_type", sa.String(20), server_default="internal"),
        sa.Column("display_priority", sa.Integer(), server_default="0"),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("publish_at", sa.DateTime(timezone=True)),
        sa.Column("expires_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True)),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_hero_carousel_priority", "hero_carousel_slides", ["display_priority"])

    op.add_column("events", sa.Column("cover_image_url", sa.String(500)))
    op.add_column("events", sa.Column("short_description", sa.Text()))
    op.add_column("events", sa.Column("submission_deadline", sa.Date()))
    op.add_column("events", sa.Column("country", sa.String(100)))


def downgrade() -> None:
    op.drop_column("events", "country")
    op.drop_column("events", "submission_deadline")
    op.drop_column("events", "short_description")
    op.drop_column("events", "cover_image_url")
    op.drop_index("ix_hero_carousel_priority", table_name="hero_carousel_slides")
    op.drop_table("hero_carousel_slides")
