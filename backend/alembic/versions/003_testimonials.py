"""testimonials table

Revision ID: 003
Revises: 002
Create Date: 2026-05-27

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "testimonials",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("position_title", sa.String(255)),
        sa.Column("institution", sa.String(255)),
        sa.Column("country", sa.String(100)),
        sa.Column("profile_image_url", sa.String(500)),
        sa.Column("testimonial_text", sa.Text(), nullable=False),
        sa.Column("rating", sa.Integer()),
        sa.Column("display_priority", sa.Integer(), server_default="0"),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True)),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_testimonials_priority", "testimonials", ["display_priority"])


def downgrade() -> None:
    op.drop_index("ix_testimonials_priority", table_name="testimonials")
    op.drop_table("testimonials")
