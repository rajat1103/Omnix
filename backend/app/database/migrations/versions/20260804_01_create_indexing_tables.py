"""create indexing tables

Revision ID: 20260804_01_create_indexing_tables
Revises:
Create Date: 2026-08-04 00:00:00.000000
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260804_01_create_indexing_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "indexed_folders",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("folder_name", sa.String(length=255), nullable=False),
        sa.Column("folder_path", sa.String(length=1024), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_scan_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("folder_path", name="uq_indexed_folders_folder_path"),
    )
    op.create_index("ix_indexed_folders_folder_path", "indexed_folders", ["folder_path"])

    op.create_table(
        "indexed_files",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("folder_id", sa.String(length=36), sa.ForeignKey("indexed_folders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("extension", sa.String(length=32), nullable=False),
        sa.Column("absolute_path", sa.String(length=1024), nullable=False),
        sa.Column("parent_directory", sa.String(length=1024), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("mime_type", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("modified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("indexed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_hidden", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("file_hash", sa.String(length=128), nullable=True),
    )
    op.create_index("ix_indexed_files_folder_id", "indexed_files", ["folder_id"])


def downgrade() -> None:
    op.drop_index("ix_indexed_files_folder_id", table_name="indexed_files")
    op.drop_table("indexed_files")
    op.drop_index("ix_indexed_folders_folder_path", table_name="indexed_folders")
    op.drop_table("indexed_folders")
