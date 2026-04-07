-- ============================================================
-- Educational Platform - DAW Group 9
-- V1: Initial schema
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role         AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE course_level      AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE course_status     AS ENUM ('draft', 'published', 'archived');
CREATE TYPE lesson_type       AS ENUM ('video', 'article', 'quiz');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled');

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE users (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash TEXT         NOT NULL,
  avatar_url    TEXT,
  role          user_role    NOT NULL DEFAULT 'student',
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_users_email UNIQUE (email)
);

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE categories (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id   UUID         REFERENCES categories(id) ON DELETE SET NULL,

  CONSTRAINT uq_categories_slug UNIQUE (slug)
);

-- ============================================================
-- TABLE: courses
-- ============================================================
CREATE TABLE courses (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255)  NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  level         course_level  NOT NULL DEFAULT 'beginner',
  status        course_status NOT NULL DEFAULT 'draft',
  instructor_id UUID          NOT NULL REFERENCES users(id)       ON DELETE RESTRICT,
  category_id   UUID          REFERENCES categories(id)           ON DELETE SET NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: modules
-- ============================================================
CREATE TABLE modules (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    UUID         NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  position     SMALLINT     NOT NULL CHECK (position > 0),
  is_published BOOLEAN      NOT NULL DEFAULT FALSE,

  CONSTRAINT uq_modules_position_course UNIQUE (course_id, position)
);

-- ============================================================
-- TABLE: lessons
-- ============================================================
CREATE TABLE lessons (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id    UUID         NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  video_url    TEXT,
  duration_sec INTEGER      NOT NULL DEFAULT 0 CHECK (duration_sec >= 0),
  position     SMALLINT     NOT NULL CHECK (position > 0),
  type         lesson_type  NOT NULL DEFAULT 'video',
  is_preview   BOOLEAN      NOT NULL DEFAULT FALSE,
  is_published BOOLEAN      NOT NULL DEFAULT FALSE,

  CONSTRAINT uq_lessons_position_module UNIQUE (module_id, position)
);

-- ============================================================
-- TABLE: enrollments
-- ============================================================
CREATE TABLE enrollments (
  id           UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID               NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  course_id    UUID               NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status       enrollment_status  NOT NULL DEFAULT 'active',
  progress     NUMERIC(5,2)       NOT NULL DEFAULT 0
                                  CHECK (progress BETWEEN 0 AND 100),
  enrolled_at  TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  CONSTRAINT uq_enrollments_user_course UNIQUE (user_id, course_id)
);

-- ============================================================
-- TABLE: lesson_progress
-- ============================================================
CREATE TABLE lesson_progress (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID        NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id       UUID        NOT NULL REFERENCES lessons(id)     ON DELETE CASCADE,
  is_completed    BOOLEAN     NOT NULL DEFAULT FALSE,
  seconds_watched INTEGER     NOT NULL DEFAULT 0 CHECK (seconds_watched >= 0),
  last_watched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_lesson_progress_enrollment_lesson UNIQUE (enrollment_id, lesson_id)
);

-- ============================================================
-- TABLE: certificates
-- ============================================================
CREATE TABLE certificates (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID        NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  code          VARCHAR(64) NOT NULL,
  pdf_url       TEXT,
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_certificates_enrollment UNIQUE (enrollment_id),
  CONSTRAINT uq_certificates_code       UNIQUE (code)
);

-- ============================================================
-- TABLE: comments
-- ============================================================
CREATE TABLE comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  lesson_id  UUID        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  parent_id  UUID        REFERENCES comments(id)         ON DELETE CASCADE,
  content    TEXT        NOT NULL CHECK (char_length(content) > 0),
  likes      INTEGER     NOT NULL DEFAULT 0 CHECK (likes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE reviews (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  course_id  UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating     SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_reviews_user_course UNIQUE (user_id, course_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_users_email         ON users(email);
CREATE INDEX idx_users_role          ON users(role);
CREATE INDEX idx_courses_instructor  ON courses(instructor_id);
CREATE INDEX idx_courses_category    ON courses(category_id);
CREATE INDEX idx_courses_status      ON courses(status);
CREATE INDEX idx_modules_course      ON modules(course_id);
CREATE INDEX idx_lessons_module      ON lessons(module_id);
CREATE INDEX idx_enrollments_user    ON enrollments(user_id);
CREATE INDEX idx_enrollments_course  ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
CREATE INDEX idx_lesson_progress_lesson     ON lesson_progress(lesson_id);
CREATE INDEX idx_comments_lesson     ON comments(lesson_id);
CREATE INDEX idx_comments_user       ON comments(user_id);
CREATE INDEX idx_comments_parent     ON comments(parent_id);
CREATE INDEX idx_reviews_course      ON reviews(course_id);

-- ============================================================
-- FUNCTION + TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- FUNCTION + TRIGGER: auto-recalculate enrollment progress
-- ============================================================
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
                            THEN 'completed'::enrollment_status
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

CREATE TRIGGER trg_lesson_progress_after
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION fn_recalculate_progress();
