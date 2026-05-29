"""contact inquiries table

Revision ID: 005
Revises: 004
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "contact_inquiries",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("institution", sa.String(255), nullable=True),
        sa.Column("country", sa.String(100), nullable=True),
        sa.Column("inquiry_type", sa.String(80), nullable=False),
        sa.Column("subject", sa.String(500), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="new"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_contact_inquiries_email", "contact_inquiries", ["email"])


def downgrade() -> None:
    op.drop_index("ix_contact_inquiries_email", table_name="contact_inquiries")
    op.drop_table("contact_inquiries")
