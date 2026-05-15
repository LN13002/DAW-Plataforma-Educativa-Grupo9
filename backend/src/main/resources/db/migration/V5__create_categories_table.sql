-- ============================================================
-- V5: Normalize categories timestamps without destructive changes
-- ============================================================
-- NOTE: The categories table already exists since V1.
-- This migration must be non-destructive to preserve FK integrity.

ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE categories
SET created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE created_at IS NULL OR updated_at IS NULL;
