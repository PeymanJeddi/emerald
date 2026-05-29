"""user academic profile fields

Revision ID: 006
Revises: 005
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("first_name", sa.String(100), nullable=True))
    op.add_column("users", sa.Column("last_name", sa.String(100), nullable=True))
    op.add_column("users", sa.Column("middle_name", sa.String(100), nullable=True))
    op.add_column("users", sa.Column("backup_email", sa.String(255), nullable=True))
    op.add_column("users", sa.Column("phone_number", sa.String(50), nullable=True))
    op.add_column("users", sa.Column("whatsapp_number", sa.String(50), nullable=True))
    op.add_column("users", sa.Column("preferred_language", sa.String(20), nullable=True))
    op.add_column("users", sa.Column("profile_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column("users", sa.Column("profile_completion_percent", sa.Integer(), server_default="0", nullable=False))
    op.add_column("users", sa.Column("profile_status", sa.String(30), server_default="incomplete", nullable=False))


def downgrade() -> None:
    op.drop_column("users", "profile_status")
    op.drop_column("users", "profile_completion_percent")
    op.drop_column("users", "profile_json")
    op.drop_column("users", "preferred_language")
    op.drop_column("users", "whatsapp_number")
    op.drop_column("users", "phone_number")
    op.drop_column("users", "backup_email")
    op.drop_column("users", "middle_name")
    op.drop_column("users", "last_name")
    op.drop_column("users", "first_name")
