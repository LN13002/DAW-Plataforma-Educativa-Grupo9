-- 1. Eliminamos el valor por defecto para que no bloquee el cambio de tipo
ALTER TABLE enrollments ALTER COLUMN status DROP DEFAULT;

-- 2. Cambiamos el tipo a VARCHAR con una conversión explícita
ALTER TABLE enrollments
  ALTER COLUMN status TYPE VARCHAR(50)
  USING status::text;

-- 3. Volvemos a poner el valor por defecto como texto
ALTER TABLE enrollments ALTER COLUMN status SET DEFAULT 'active';

-- 4. Eliminamos el tipo enum ya que no se usa en ninguna otra tabla
DROP TYPE IF EXISTS enrollment_status;
