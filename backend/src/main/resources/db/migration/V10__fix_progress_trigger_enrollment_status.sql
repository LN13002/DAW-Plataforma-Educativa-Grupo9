CREATE OR REPLACE FUNCTION fn_recalculate_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons     INTEGER;
  completed_lessons INTEGER;
BEGIN
  SELECT COUNT(l.id)
    INTO total_lessons
    FROM lessons l
    JOIN modules m     ON l.module_id = m.id
    JOIN courses c     ON m.course_id = c.id
    JOIN enrollments e ON e.course_id = c.id
   WHERE e.id = NEW.enrollment_id
     AND l.is_published = TRUE;

  SELECT COUNT(*)
    INTO completed_lessons
    FROM lesson_progress
   WHERE enrollment_id = NEW.enrollment_id
     AND is_completed  = TRUE;

  IF total_lessons > 0 THEN
    UPDATE enrollments
       SET progress     = ROUND((completed_lessons::NUMERIC / total_lessons) * 100, 2),
           status       = CASE
                            WHEN completed_lessons = total_lessons
                            THEN 'completed'
                            ELSE status
                          END,
           completed_at = CASE
                            WHEN completed_lessons = total_lessons
                             AND completed_at IS NULL
                            THEN NOW()
                            ELSE completed_at
                          END
     WHERE id = NEW.enrollment_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;