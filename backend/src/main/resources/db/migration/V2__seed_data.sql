-- ============================================================
-- V2: Seed data for development
-- ============================================================

INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES
  ('Admin',  'System',   'admin@platform.com', '$2b$12$placeholder_hash_admin',  'admin'),
  ('Maria',  'Gonzalez', 'maria@platform.com', '$2b$12$placeholder_hash_maria',  'instructor'),
  ('Carlos', 'Lopez',    'carlos@platform.com','$2b$12$placeholder_hash_carlos', 'student');

INSERT INTO categories (name, slug) VALUES
  ('Programming', 'programming'),
  ('Design',      'design'),
  ('Marketing',   'marketing');

INSERT INTO categories (name, slug, parent_id)
VALUES ('Frontend', 'frontend',
        (SELECT id FROM categories WHERE slug = 'programming'));
