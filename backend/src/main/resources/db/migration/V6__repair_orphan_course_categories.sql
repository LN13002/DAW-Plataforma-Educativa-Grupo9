-- ============================================================
-- V6: Repair orphan category references in courses
-- ============================================================

UPDATE courses c
SET category_id = NULL
WHERE category_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM categories cat
    WHERE cat.id = c.category_id
  );
