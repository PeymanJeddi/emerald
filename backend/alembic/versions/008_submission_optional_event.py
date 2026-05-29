"""allow draft submissions without event

Revision ID: 008
Revises: 007
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "008"
down_revision: Union[str, None] = "007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("submissions", "event_id", existing_type=sa.String(32), nullable=True)


def downgrade() -> None:
    op.alter_column("submissions", "event_id", existing_type=sa.String(32), nullable=False)
