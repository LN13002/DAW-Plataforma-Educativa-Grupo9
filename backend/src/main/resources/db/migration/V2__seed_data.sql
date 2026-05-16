-- ============================================================
-- V2: Seed data for development
-- ============================================================

INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES
  ('Administrador',  'Sistema',   'admin@platform.com', '$2b$12$placeholder_hash_admin',  'admin'),
  ('María',  'González', 'maria@platform.com', '$2b$12$placeholder_hash_maria',  'instructor'),
  ('Carlos', 'López',    'carlos@platform.com','$2b$12$placeholder_hash_carlos', 'student');

INSERT INTO categories (name, slug) VALUES
  ('Programación', 'programacion'),
  ('Diseño',      'diseno'),
  ('Mercadeo',   'mercadeo');

INSERT INTO categories (name, slug, parent_id)
VALUES ('Desarrollo Frontend', 'frontend',
        (SELECT id FROM categories WHERE slug = 'programacion'));
