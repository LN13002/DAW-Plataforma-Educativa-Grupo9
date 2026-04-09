-- 1. Eliminamos el valor por defecto para que no bloquee el cambio de tipo
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- 2. Cambiamos el tipo a VARCHAR con una conversión explícita
ALTER TABLE users 
  ALTER COLUMN role TYPE VARCHAR(50) 
  USING role::text;

-- 3. Volvemos a poner el valor por defecto como texto
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'student';

-- 4. Ahora sí podemos borrar el tipo enum si ya no se usa
DROP TYPE IF EXISTS user_role;