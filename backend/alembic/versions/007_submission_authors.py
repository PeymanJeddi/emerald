"""submission authors and invitations

Revision ID: 007
Revises: 006
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "007"
down_revision: Union[str, None] = "006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "submission_authors",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("submission_id", sa.String(32), sa.ForeignKey("submissions.id"), nullable=False),
        sa.Column("user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("role", sa.String(30), nullable=False, server_default="co_author"),
        sa.Column("author_order", sa.Integer(), nullable=False, server_default="2"),
        sa.Column("status", sa.String(30), nullable=False, server_default="added"),
        sa.Column("added_by_user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("added_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("confirmed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_submission_authors_submission_id", "submission_authors", ["submission_id"])

    op.create_table(
        "submission_author_invitations",
        sa.Column("id", sa.String(32), primary_key=True),
        sa.Column("submission_id", sa.String(32), sa.ForeignKey("submissions.id"), nullable=False),
        sa.Column("invited_email", sa.String(255), nullable=False),
        sa.Column("invited_by_user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(30), nullable=False, server_default="sent"),
        sa.Column("token", sa.String(64), nullable=False, unique=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("registered_user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=True),
    )
    op.create_index(
        "ix_submission_author_invitations_submission_id",
        "submission_author_invitations",
        ["submission_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_submission_author_invitations_submission_id", "submission_author_invitations")
    op.drop_table("submission_author_invitations")
    op.drop_index("ix_submission_authors_submission_id", "submission_authors")
    op.drop_table("submission_authors")
