-- ============================================================
-- V3: Realistic seed data
-- Replaces V2 minimal seed with a comprehensive realistic dataset.
-- All passwords are bcrypt hashes of "aprende123".
-- ============================================================

-- Clear previous seed data (cascades to all dependent tables)
TRUNCATE TABLE users, categories CASCADE;

-- ============================================================
-- USERS  (1 admin · 3 instructors · 5 students)
-- ============================================================
INSERT INTO users (first_name, last_name, email, password_hash, role, avatar_url) VALUES

  -- Admin
  ('Administrador', 'Sistema',
   'admin@aprende.ues',
   '$2b$12$LWiGpfHT3Y5mP9tD8bX6OuXxJ7ZMT4RkQ2dN1pV3sW8aK0cE5uYrA',
   'admin', NULL),

  -- Instructors
  ('Sofía',  'Ramírez',
   'sofia.ramirez@aprende.ues',
   '$2b$12$rI9TJwuRvJN.mExN5qKT8eQM4DRHKxT.UuBTONaJ5EtMk5CfBUwt6',
   'instructor', 'https://i.pravatar.cc/150?u=sofia.ramirez'),

  ('Diego', 'Martínez',
   'diego.martinez@aprende.ues',
   '$2b$12$9vX3Kp7mL4qN2cA8hR5tOeYjW1bF6sD0uI9nE7wG4kM3zQ2cX1pUo',
   'instructor', 'https://i.pravatar.cc/150?u=diego.martinez'),

  ('Ana', 'Gutiérrez',
   'ana.gutierrez@aprende.ues',
   '$2b$12$hJ4mK9pL2nQ8cV5bA7xO3eWrT6sD1uY0fI8gN5kM4zQ3cX2pRoV1w',
   'instructor', 'https://i.pravatar.cc/150?u=ana.gutierrez'),

  -- Students
  ('Carlos',  'López',
   'carlos.lopez@aprende.ues',
   '$2b$12$yT8nJ3kM5pL7qO2cA9xR4eWbV1sD6uI0fN9gE8wG5kM4zQ2cX1pU',
   'student', 'https://i.pravatar.cc/150?u=carlos.lopez'),

  ('Andrea', 'Torres',
   'andrea.torres@aprende.ues',
   '$2b$12$wR6mK4pJ2nQ7cV8bA5xO1eWrT3sD9uY2fI0gN8kM5zQ4cX3pRoV2',
   'student', 'https://i.pravatar.cc/150?u=andrea.torres'),

  ('Miguel', 'Hernández',
   'miguel.hernandez@aprende.ues',
   '$2b$12$uP5mJ2kL4nQ6cV7bA3xO8eWrT2sD0uY1fI9gN7kM3zQ1cX2pRoV3',
   'student', 'https://i.pravatar.cc/150?u=miguel.hernandez'),

  ('Laura', 'Sánchez',
   'laura.sanchez@aprende.ues',
   '$2b$12$tO4mI1kJ3nQ5cV6bA2xO7eWrT1sD8uY0fI6gN5kM2zQ0cX1pRoV4',
   'student', 'https://i.pravatar.cc/150?u=laura.sanchez'),

  ('Roberto', 'Cruz',
   'roberto.cruz@aprende.ues',
   '$2b$12$sN3mH0kI2nQ4cV5bA1xO6eWrT0sD7uY9fI5gN4kM1zQ9cX0pRoV5',
   'student', 'https://i.pravatar.cc/150?u=roberto.cruz');

-- ============================================================
-- CATEGORIES  (3 root · 4 sub)
-- ============================================================
INSERT INTO categories (name, slug, description) VALUES
  ('Programación',  'programacion',  'Cursos de desarrollo de software y programación'),
  ('Diseño',       'diseno',       'Cursos de diseño visual, experiencia de usuario y creatividad'),
  ('Ciencia de Datos', 'ciencia-datos', 'Análisis de datos, aprendizaje automático y estadística');

INSERT INTO categories (name, slug, description, parent_id) VALUES
  ('Desarrollo Frontend', 'frontend',
   'HTML, CSS, JavaScript y frameworks modernos',
   (SELECT id FROM categories WHERE slug = 'programacion')),

  ('Desarrollo Backend', 'backend',
   'Servidores, APIs REST, bases de datos y DevOps',
   (SELECT id FROM categories WHERE slug = 'programacion')),

  ('Diseño UX / UI', 'ux-ui',
   'Investigación de experiencia de usuario, wireframes y prototipos',
   (SELECT id FROM categories WHERE slug = 'diseno')),

  ('Aprendizaje Automático', 'aprendizaje-automatico',
   'Algoritmos de aprendizaje automático, aprendizaje profundo y aplicaciones de IA',
   (SELECT id FROM categories WHERE slug = 'ciencia-datos'));

-- ============================================================
-- COURSES  (5 published · 1 draft)
-- ============================================================
INSERT INTO courses (title, description, thumbnail_url, level, status, instructor_id, category_id) VALUES

  (
    'Fundamentos de HTML y CSS',
    'Aprende las bases de la web. Domina la estructura HTML y los estilos CSS para crear páginas atractivas y responsivas desde cero. Al final publicarás un portafolio real.',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
    'beginner', 'published',
    (SELECT id FROM users WHERE email = 'sofia.ramirez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'frontend')
  ),

  (
    'JavaScript desde Cero hasta Experto',
    'Pasa de principiante absoluto a desarrollar con confianza en JavaScript. Estudia variables, funciones, manipulación del DOM, programación asíncrona y termina con un proyecto real que consume una API pública.',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
    'beginner', 'published',
    (SELECT id FROM users WHERE email = 'sofia.ramirez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'frontend')
  ),

  (
    'React: Construcción de Interfaces Modernas',
    'Domina React 18 con hooks, context y React Router. Construye tres aplicaciones completas: un gestor de tareas, un panel del clima y un feed social, todas conectadas a APIs reales.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    'intermediate', 'published',
    (SELECT id FROM users WHERE email = 'sofia.ramirez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'frontend')
  ),

  (
    'Python para Análisis de Datos',
    'Aprende Python, pandas y Matplotlib para explorar, limpiar y visualizar conjuntos de datos reales. No necesitas experiencia previa en programación: empieza desde cero y construye un panel completo de datos.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    'beginner', 'published',
    (SELECT id FROM users WHERE email = 'diego.martinez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'ciencia-datos')
  ),

  (
    'Fundamentos de Diseño UX',
    'Comprende el diseño centrado en usuarios desde la investigación hasta el prototipo de alta fidelidad. Practica design thinking, wireframes en Figma y pruebas de usabilidad con participantes reales.',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    'beginner', 'published',
    (SELECT id FROM users WHERE email = 'ana.gutierrez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'ux-ui')
  ),

  (
    'APIs REST con Node.js y Express',
    'Diseña y construye APIs REST listas para producción. Cubre rutas, middleware, autenticación JWT, validación de entradas, manejo de errores y conexión a PostgreSQL con un ORM.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    'intermediate', 'draft',
    (SELECT id FROM users WHERE email = 'sofia.ramirez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'backend')
  );

-- ============================================================
-- MODULES
-- ============================================================

-- Course 1: HTML & CSS Fundamentals
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Introducción a HTML', 'Comprende la estructura de toda página web.', 1, TRUE
FROM courses WHERE title = 'Fundamentos de HTML y CSS';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Estilos con CSS', 'Haz que tus páginas se vean bien usando selectores, modelo de caja, Flexbox y Grid.', 2, TRUE
FROM courses WHERE title = 'Fundamentos de HTML y CSS';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Construcción de un Proyecto Real', 'Integra todo y publica un portafolio responsivo.', 3, TRUE
FROM courses WHERE title = 'Fundamentos de HTML y CSS';

-- Course 2: JavaScript from Zero to Hero
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Fundamentos de JavaScript', 'Variables, tipos de datos, operadores y flujo de control.', 1, TRUE
FROM courses WHERE title = 'JavaScript desde Cero hasta Experto';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Trabajo con Datos', 'Arreglos, objetos, destructuring y operador spread.', 2, TRUE
FROM courses WHERE title = 'JavaScript desde Cero hasta Experto';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'El DOM y JavaScript Asíncrono', 'Manipula el DOM, maneja eventos y consume datos desde APIs.', 3, TRUE
FROM courses WHERE title = 'JavaScript desde Cero hasta Experto';

-- Course 3: React
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Conceptos Principales de React', 'JSX, componentes, props y estado con useState.', 1, TRUE
FROM courses WHERE title = 'React: Construcción de Interfaces Modernas';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Hooks y Efectos Secundarios', 'useEffect, hooks personalizados y estado global con useContext.', 2, TRUE
FROM courses WHERE title = 'React: Construcción de Interfaces Modernas';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Construcción de una Aplicación Completa', 'React Router, integración con API y proyecto final integrador.', 3, TRUE
FROM courses WHERE title = 'React: Construcción de Interfaces Modernas';

-- Course 4: Python for Data Analysis
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Esenciales de Python', 'Sintaxis, tipos de datos, listas, diccionarios, funciones y módulos.', 1, TRUE
FROM courses WHERE title = 'Python para Análisis de Datos';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Análisis de Datos con pandas', 'DataFrames, limpieza de datos, agrupamiento y agregación.', 2, TRUE
FROM courses WHERE title = 'Python para Análisis de Datos';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Visualización de Datos', 'Gráficas con Matplotlib y Seaborn, y construcción de un panel de datos.', 3, TRUE
FROM courses WHERE title = 'Python para Análisis de Datos';

-- Course 5: UX Design
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Pensamiento de Diseño', 'Empatizar, definir e idear: las primeras tres fases del pensamiento de diseño.', 1, TRUE
FROM courses WHERE title = 'Fundamentos de Diseño UX';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Wireframes y Prototipado', 'Desde bocetos en papel hasta prototipos interactivos en Figma.', 2, TRUE
FROM courses WHERE title = 'Fundamentos de Diseño UX';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Pruebas de Usabilidad', 'Planifica, ejecuta y analiza pruebas de usabilidad con usuarios reales.', 3, TRUE
FROM courses WHERE title = 'Fundamentos de Diseño UX';

-- Course 6: Node.js (DRAFT — modules not published)
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Bases de Node.js', 'El event loop, npm y tu primer servidor HTTP.', 1, FALSE
FROM courses WHERE title = 'APIs REST con Node.js y Express';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Express.js', 'Rutas, middleware, manejo de errores y validación de solicitudes.', 2, FALSE
FROM courses WHERE title = 'APIs REST con Node.js y Express';

-- ============================================================
-- LESSONS
-- Helper: reference a module by its course title + module title
-- ============================================================

-- ── Course 1: HTML & CSS Fundamentals ────────────────────────

-- Module: Introduction to HTML
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Cómo Funciona la Web',
       'Navegadores, servidores y solicitudes HTTP: comprende qué ocurre cuando visitas una URL.',
       'https://www.youtube.com/embed/hJHvdBlSxug', 540, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Introducción a HTML';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Tu Primer Documento HTML',
       'Crea desde cero un archivo HTML5 válido: doctype, head, body y tus primeras etiquetas.',
       'https://www.youtube.com/embed/UB1O30fR-EE', 780, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Introducción a HTML';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Elementos Semánticos de HTML',
       'Reemplaza divs genéricos con header, nav, main, section, article y footer.',
       'https://www.youtube.com/embed/kGW8Al_cga4', 900, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Introducción a HTML';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Formularios y Campos en HTML',
       'Construye formularios accesibles con text, email, select, checkbox, radio y textarea.',
       'https://www.youtube.com/embed/fNcJuPIZ2WE', 1080, 4, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Introducción a HTML';

-- Module: Styling with CSS
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Selectores y Especificidad en CSS',
       'Selectores de clase, ID, atributo, pseudo-clase y pseudo-elemento, y cómo la especificidad resuelve conflictos.',
       'https://www.youtube.com/embed/l1mER1bV0N0', 660, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Estilos con CSS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'El Modelo de Caja',
       'Domina contenido, relleno, borde y margen. Comprende box-sizing: border-box.',
       'https://www.youtube.com/embed/rIO5326FgPE', 840, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Estilos con CSS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Diseño con Flexbox',
       'Alinea y distribuye elementos en una dimensión con display:flex, gap, align-items y justify-content.',
       'https://www.youtube.com/embed/phWxA89Dy94', 1200, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Estilos con CSS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Diseño con CSS Grid',
       'Construye diseños bidimensionales con grid-template-columns, grid-template-rows y áreas de grid.',
       'https://www.youtube.com/embed/jV8B24rSN5o', 1380, 4, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Estilos con CSS';

-- Module: Building a Real Project
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Planificación de tu Portafolio',
       'Dibuja tu layout en papel y define paleta de colores y tipografía antes de escribir código.',
       NULL, 360, 1, 'article', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Construcción de un Proyecto Real';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Construcción de la Página de Portafolio',
       'Programa el portafolio completo: encabezado, hero, grid de proyectos y sección de contacto.',
       'https://www.youtube.com/embed/r_hYR53r61M', 2400, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Construcción de un Proyecto Real';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Haciéndolo Responsivo',
       'Agrega media queries para que tu portafolio se vea bien en móvil, tablet y escritorio.',
       'https://www.youtube.com/embed/bn-DQznsbIMk', 1080, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de HTML y CSS' AND m.title = 'Construcción de un Proyecto Real';

-- ── Course 2: JavaScript from Zero to Hero ───────────────────

-- Module: JS Fundamentals
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Variables y Tipos de Datos',
       'var vs let vs const, tipos primitivos, typeof y conversión de tipos.',
       'https://www.youtube.com/embed/hdI2bqOjy3c', 780, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'Fundamentos de JavaScript';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Flujo de Control y Bucles',
       'if/else, switch, ternario, for, while y for...of: decide y repite.',
       'https://www.youtube.com/embed/IsG4Xd6LlsM', 900, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'Fundamentos de JavaScript';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Funciones y Alcance',
       'Declaraciones, expresiones, funciones flecha, parámetros por defecto, closures y call stack.',
       'https://www.youtube.com/embed/gigtS_5KKas', 1080, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'Fundamentos de JavaScript';

-- Module: Working with Data
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Arreglos y Métodos de Arreglos',
       'map, filter, reduce, find, some y every: manipulación funcional de arreglos.',
       'https://www.youtube.com/embed/R8rmfD9Y5-c', 1080, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'Trabajo con Datos';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Objetos y JSON',
       'Objetos literales, notación de punto vs corchetes, métodos y JSON.parse / JSON.stringify.',
       'https://www.youtube.com/embed/_5jdE6imZ9o', 960, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'Trabajo con Datos';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Destructuring y Spread',
       'Desempaqueta arreglos y objetos, usa parámetros rest y compone datos con el operador spread.',
       'https://www.youtube.com/embed/NIq3qLaHCIs', 840, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'Trabajo con Datos';

-- Module: The DOM and Async JS
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Selección y Manipulación del DOM',
       'querySelector, innerHTML, classList, style, createElement y appendChild.',
       'https://www.youtube.com/embed/0ik6X4DJKCc', 1080, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'El DOM y JavaScript Asíncrono';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Eventos y Event Listeners',
       'addEventListener, delegación de eventos, preventDefault, stopPropagation y eventos de teclado.',
       'https://www.youtube.com/embed/XF1_MlZ5l6M', 900, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'El DOM y JavaScript Asíncrono';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Promesas y Async/Await',
       'Event loop, callbacks, cadenas de promesas y código asíncrono más limpio con async/await.',
       'https://www.youtube.com/embed/PoRJizFvM7s', 1320, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'El DOM y JavaScript Asíncrono';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Obtención de Datos con Fetch API',
       'Solicitudes GET y POST, manejo de respuestas JSON, manejo de errores y construcción de una app del clima en vivo.',
       'https://www.youtube.com/embed/cuEtnrL9-H0', 1200, 4, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript desde Cero hasta Experto' AND m.title = 'El DOM y JavaScript Asíncrono';

-- ── Course 3: React ───────────────────────────────────────────

-- Module: React Core Concepts
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Por Qué React y Cómo Funciona',
       'El DOM virtual, la reconciliación y por qué las interfaces basadas en componentes escalan mejor.',
       'https://www.youtube.com/embed/Tn6-PIqc4UM', 660, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Conceptos Principales de React';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'JSX y tu Primer Componente',
       'Escribe JSX, comprende las reglas, crea componentes funcionales y pasa props.',
       'https://www.youtube.com/embed/w7ejDZ8SWv8', 1200, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Conceptos Principales de React';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Manejo de Estado con useState',
       'Declara estado, dispara renderizados, maneja formularios y eleva estado a componentes padre.',
       'https://www.youtube.com/embed/O6P86uwfdR0', 1500, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Conceptos Principales de React';

-- Module: Hooks and Side Effects
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'useEffect y el Ciclo de Vida del Componente',
       'Ejecuta efectos al montar, actualizar y desmontar: consulta datos, configura temporizadores y suscríbete a eventos.',
       'https://www.youtube.com/embed/0ZJgIjIuY7U', 1200, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Hooks y Efectos Secundarios';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Construcción de Hooks Personalizados',
       'Extrae y reutiliza lógica con estado entre componentes usando tus propios hooks useFetch y useLocalStorage.',
       'https://www.youtube.com/embed/6ThXsUwLWvc', 1080, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Hooks y Efectos Secundarios';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Estado Global con useContext',
       'Evita prop drilling creando un contexto, un provider y consumiéndolo con useContext.',
       'https://www.youtube.com/embed/5LrDIWkK_Bc', 1320, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Hooks y Efectos Secundarios';

-- Module: Building a Full App
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Rutas del Cliente con React Router',
       'Define rutas, usa Link y NavLink, lee parámetros de URL y protege rutas privadas.',
       'https://www.youtube.com/embed/59IXY5IDrBA', 1260, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Construcción de una Aplicación Completa';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Conexión a una API REST',
       'Consulta, muestra y pagina datos desde una API real. Maneja estados de carga y error correctamente.',
       'https://www.youtube.com/embed/dtKciwk_si4', 1080, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Construcción de una Aplicación Completa';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Proyecto Final: Aplicación Completa de Feed Social',
       'Construye un feed social completo con autenticación, publicaciones, likes y comentarios, integrado con el backend.',
       'https://www.youtube.com/embed/b9eMGE7QtTk', 3600, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Construcción de Interfaces Modernas' AND m.title = 'Construcción de una Aplicación Completa';

-- ── Course 4: Python for Data Analysis ───────────────────────

-- Module: Python Essentials
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Sintaxis de Python y Tipos de Datos',
       'Cadenas, enteros, flotantes, booleanos y None. Variables, print e input.',
       'https://www.youtube.com/embed/_uQrJ0TkZlc', 960, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Esenciales de Python';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Listas, Tuplas y Diccionarios',
       'Crea, indexa, corta e itera colecciones de Python. Comprende la mutabilidad.',
       'https://www.youtube.com/embed/W8KRzm-HUcc', 1080, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Esenciales de Python';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Funciones y Módulos',
       'Define funciones reutilizables, usa *args y **kwargs e importa desde la biblioteca estándar.',
       'https://www.youtube.com/embed/9Os0o3wzS_I', 900, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Esenciales de Python';

-- Module: Data Analysis with pandas
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Introducción a DataFrames de pandas',
       'Carga archivos CSV y JSON, inspecciona shape, dtypes, head, describe e info.',
       'https://www.youtube.com/embed/vmEHCJofslg', 1260, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Análisis de Datos con pandas';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Limpieza y Transformación de Datos',
       'Maneja valores faltantes, renombra columnas, cambia dtypes y aplica funciones personalizadas.',
       'https://www.youtube.com/embed/bDhvCp3_lYw', 1500, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Análisis de Datos con pandas';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Agrupamiento y Agregación',
       'groupby, tablas dinámicas, merge y concat: responde preguntas reales de negocio con datos.',
       'https://www.youtube.com/embed/Wb2Tp35dZ-I', 1200, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Análisis de Datos con pandas';

-- Module: Data Visualization
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Bases de Matplotlib',
       'Gráficas de línea, barras, dispersión e histogramas. Personaliza títulos, ejes, colores y leyendas.',
       'https://www.youtube.com/embed/3Xc3CA655Y4', 960, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Visualización de Datos';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Gráficas Atractivas con Seaborn',
       'Heatmaps, pair plots, gráficas de violín y visualizaciones estadísticas con una sola línea.',
       'https://www.youtube.com/embed/6GUZXDef2U0', 1080, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Visualización de Datos';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Proyecto Final: Panel de Análisis de Ventas',
       'Combina todo: carga un conjunto de ventas real, límpialo, analízalo y produce un reporte visual completo.',
       'https://www.youtube.com/embed/r-uOLxNrNk8', 2100, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python para Análisis de Datos' AND m.title = 'Visualización de Datos';

-- ── Course 5: UX Design Fundamentals ─────────────────────────

-- Module: Design Thinking
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       '¿Qué es el Diseño UX?',
       'UX vs UI, el proceso de diseño UX y por qué la empatía es la herramienta más importante del diseño.',
       'https://www.youtube.com/embed/v6n1i0qojkA', 600, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Pensamiento de Diseño';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Métodos de Investigación de Usuarios',
       'Entrevistas, encuestas, investigación contextual, card sorting y síntesis de hallazgos.',
       'https://www.youtube.com/embed/Ovj-ySJ0bvg', 1200, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Pensamiento de Diseño';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Personas y Mapas de Recorrido de Usuario',
       'Convierte investigación en personas y mapas de recorrido accionables para todo el equipo.',
       NULL, 480, 3, 'article', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Pensamiento de Diseño';

-- Module: Wireframing & Prototyping
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Bocetos y Wireframes de Baja Fidelidad',
       'Prototipado en papel, Crazy 8s e ideación rápida: falla rápido antes de abrir Figma.',
       NULL, 420, 1, 'article', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Wireframes y Prototipado';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Wireframes de Alta Fidelidad en Figma',
       'Domina frames, auto-layout, componentes y tokens de diseño en Figma para crear wireframes precisos.',
       'https://www.youtube.com/embed/FTFaQWZBqQ8', 2100, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Wireframes y Prototipado';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Prototipado Interactivo',
       'Conecta frames, agrega transiciones, crea overlays y comparte un prototipo navegable con interesados.',
       'https://www.youtube.com/embed/lTIeZ2ahEkQ', 1500, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Wireframes y Prototipado';

-- Module: Usability Testing
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Planificación de una Prueba de Usabilidad',
       'Escribe un plan de prueba, define tareas, recluta participantes y prepara tu guion.',
       NULL, 540, 1, 'article', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Pruebas de Usabilidad';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Conducción de Entrevistas con Usuarios',
       'Protocolo de pensar en voz alta, toma de notas y cómo evitar dirigir a los participantes.',
       'https://www.youtube.com/embed/U9ZG19XTbd4', 1200, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Pruebas de Usabilidad';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Análisis de Resultados y Reportes',
       'Mapeo de afinidad, niveles de severidad y presentación de recomendaciones accionables.',
       'https://www.youtube.com/embed/nYCJTea5AKg', 1080, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Fundamentos de Diseño UX' AND m.title = 'Pruebas de Usabilidad';

-- ── Course 6: Node.js & Express (DRAFT — not published) ──────

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Arquitectura de Node.js y el Event Loop',
       'Por qué Node es rápido, cómo funciona el event loop y cuándo conviene usarlo.',
       'https://www.youtube.com/embed/8aGhZQkoFbQ', 840, 1, 'video', TRUE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'APIs REST con Node.js y Express' AND m.title = 'Bases de Node.js';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'npm y Gestión de Paquetes',
       'package.json, npm install, scripts, devDependencies y versionado semántico.',
       'https://www.youtube.com/embed/jHDhaSSKmB0', 720, 2, 'video', FALSE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'APIs REST con Node.js y Express' AND m.title = 'Bases de Node.js';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Tu Primer Servidor HTTP',
       'Usa el módulo http integrado para manejar solicitudes GET y POST sin frameworks.',
       'https://www.youtube.com/embed/VShtPwEkDD0', 1080, 3, 'video', FALSE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'APIs REST con Node.js y Express' AND m.title = 'Bases de Node.js';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Rutas con Express',
       'Define rutas, usa parámetros y query strings, y organiza rutas con Router.',
       'https://www.youtube.com/embed/L72fhGm1tfE', 1200, 1, 'video', TRUE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'APIs REST con Node.js y Express' AND m.title = 'Express.js';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Middleware y Manejo de Errores',
       'Escribe middleware personalizado, usa morgan y cors, y construye un manejador global de errores.',
       'https://www.youtube.com/embed/lY6icfhap2o', 960, 2, 'video', FALSE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'APIs REST con Node.js y Express' AND m.title = 'Express.js';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Conexión a PostgreSQL con un ORM',
       'Configura Prisma, define un esquema, ejecuta migraciones y realiza operaciones CRUD.',
       'https://www.youtube.com/embed/RebA5J-rlwg', 1500, 3, 'video', FALSE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'APIs REST con Node.js y Express' AND m.title = 'Express.js';

-- ============================================================
-- ENROLLMENTS
-- ============================================================
INSERT INTO enrollments (user_id, course_id, status, progress, enrolled_at, completed_at)
VALUES
  -- Carlos: HTML&CSS completed, JS active (67%)
  (
    (SELECT id FROM users WHERE email = 'carlos.lopez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Fundamentos de HTML y CSS'),
    'completed', 100.00,
    NOW() - INTERVAL '45 days', NOW() - INTERVAL '10 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'carlos.lopez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'JavaScript desde Cero hasta Experto'),
    'active', 66.67,
    NOW() - INTERVAL '8 days', NULL
  ),

  -- Andrea: HTML&CSS active (36%), React just started
  (
    (SELECT id FROM users WHERE email = 'andrea.torres@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Fundamentos de HTML y CSS'),
    'active', 36.36,
    NOW() - INTERVAL '20 days', NULL
  ),
  (
    (SELECT id FROM users WHERE email = 'andrea.torres@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'React: Construcción de Interfaces Modernas'),
    'active', 0.00,
    NOW() - INTERVAL '2 days', NULL
  ),

  -- Miguel: Python active (55%)
  (
    (SELECT id FROM users WHERE email = 'miguel.hernandez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Python para Análisis de Datos'),
    'active', 55.56,
    NOW() - INTERVAL '30 days', NULL
  ),

  -- Laura: UX completed
  (
    (SELECT id FROM users WHERE email = 'laura.sanchez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Fundamentos de Diseño UX'),
    'completed', 100.00,
    NOW() - INTERVAL '60 days', NOW() - INTERVAL '5 days'
  ),

  -- Roberto: HTML&CSS active (72%), JS started
  (
    (SELECT id FROM users WHERE email = 'roberto.cruz@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Fundamentos de HTML y CSS'),
    'active', 72.73,
    NOW() - INTERVAL '25 days', NULL
  ),
  (
    (SELECT id FROM users WHERE email = 'roberto.cruz@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'JavaScript desde Cero hasta Experto'),
    'active', 33.33,
    NOW() - INTERVAL '5 days', NULL
  );

-- ============================================================
-- LESSON PROGRESS
-- ============================================================

-- Carlos — HTML&CSS (all 11 lessons completed)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '10 days'
FROM enrollments e
JOIN courses     c  ON e.course_id  = c.id
JOIN modules     m  ON m.course_id  = c.id
JOIN lessons     l  ON l.module_id  = m.id
JOIN users       u  ON e.user_id    = u.id
WHERE u.email  = 'carlos.lopez@aprende.ues'
  AND c.title  = 'Fundamentos de HTML y CSS';

-- Carlos — JavaScript (modules 1+2 fully done, module 3 lesson 1 in progress)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '3 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'carlos.lopez@aprende.ues'
  AND c.title = 'JavaScript desde Cero hasta Experto'
  AND m.title IN ('Fundamentos de JavaScript', 'Trabajo con Datos');

INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  FALSE,
  720,
  NOW() - INTERVAL '1 day'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email  = 'carlos.lopez@aprende.ues'
  AND c.title  = 'JavaScript desde Cero hasta Experto'
  AND m.title  = 'El DOM y JavaScript Asíncrono'
  AND l.title  = 'Selección y Manipulación del DOM';

-- Andrea — HTML&CSS (module 1 all done + module 2 lesson 1 in progress)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '12 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'andrea.torres@aprende.ues'
  AND c.title = 'Fundamentos de HTML y CSS'
  AND m.title = 'Introducción a HTML';

INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  FALSE,
  400,
  NOW() - INTERVAL '2 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'andrea.torres@aprende.ues'
  AND c.title = 'Fundamentos de HTML y CSS'
  AND m.title = 'Estilos con CSS'
  AND l.title = 'Selectores y Especificidad en CSS';

-- Miguel — Python (modules 1+2 done, module 3 lesson 1 done)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '15 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'miguel.hernandez@aprende.ues'
  AND c.title = 'Python para Análisis de Datos'
  AND m.title IN ('Esenciales de Python', 'Análisis de Datos con pandas');

INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '2 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'miguel.hernandez@aprende.ues'
  AND c.title = 'Python para Análisis de Datos'
  AND m.title = 'Visualización de Datos'
  AND l.title = 'Bases de Matplotlib';

-- Laura — UX Design (all 9 lessons completed)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '5 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'laura.sanchez@aprende.ues'
  AND c.title = 'Fundamentos de Diseño UX';

-- Roberto — HTML&CSS (modules 1+2 all done + module 3 lesson 1)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '8 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'roberto.cruz@aprende.ues'
  AND c.title = 'Fundamentos de HTML y CSS'
  AND m.title IN ('Introducción a HTML', 'Estilos con CSS');

INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '1 day'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'roberto.cruz@aprende.ues'
  AND c.title = 'Fundamentos de HTML y CSS'
  AND m.title = 'Construcción de un Proyecto Real'
  AND l.title = 'Planificación de tu Portafolio';

-- Roberto — JavaScript (module 1 fully done)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '3 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'roberto.cruz@aprende.ues'
  AND c.title = 'JavaScript desde Cero hasta Experto'
  AND m.title = 'Fundamentos de JavaScript';

-- ============================================================
-- REVIEWS
-- ============================================================
INSERT INTO reviews (user_id, course_id, rating, body, created_at)
VALUES
  (
    (SELECT id FROM users  WHERE email = 'carlos.lopez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Fundamentos de HTML y CSS'),
    5,
    'Sofía explica todo con muchísima claridad. Pasé de no saber nada de HTML a publicar mi propio portafolio en solo tres semanas. El enfoque basado en proyectos ayuda a fijar cada concepto. Muy recomendado para quien empieza desde cero.',
    NOW() - INTERVAL '9 days'
  ),
  (
    (SELECT id FROM users  WHERE email = 'laura.sanchez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Fundamentos de Diseño UX'),
    5,
    'Este curso cambió por completo mi forma de pensar al construir productos. El módulo de pruebas de usabilidad me abrió los ojos: nunca había hablado con usuarios reales. Ana es una docente excelente y los ejercicios en Figma son de primer nivel.',
    NOW() - INTERVAL '4 days'
  ),
  (
    (SELECT id FROM users  WHERE email = 'roberto.cruz@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Fundamentos de HTML y CSS'),
    4,
    'Curso de fundamentos muy sólido. Las lecciones de CSS Grid y Flexbox valen muchísimo por sí solas. Me habría gustado un poco más de contenido sobre animaciones CSS, pero el proyecto de portafolio queda muy bien para mostrarlo.',
    NOW() - INTERVAL '2 days'
  );

-- ============================================================
-- CERTIFICATES  (for completed enrollments)
-- ============================================================
INSERT INTO certificates (enrollment_id, code, pdf_url, issued_at)
VALUES
  (
    (SELECT e.id FROM enrollments e
       JOIN users   u ON e.user_id   = u.id
       JOIN courses c ON e.course_id = c.id
      WHERE u.email  = 'carlos.lopez@aprende.ues'
        AND c.title  = 'Fundamentos de HTML y CSS'),
    'CERT-HTMLCSS-2025-CLO-001',
    'https://storage.aprende.ues/certificates/CERT-HTMLCSS-2025-CLO-001.pdf',
    NOW() - INTERVAL '10 days'
  ),
  (
    (SELECT e.id FROM enrollments e
       JOIN users   u ON e.user_id   = u.id
       JOIN courses c ON e.course_id = c.id
      WHERE u.email  = 'laura.sanchez@aprende.ues'
        AND c.title  = 'Fundamentos de Diseño UX'),
    'CERT-UXDES-2025-LSA-001',
    'https://storage.aprende.ues/certificates/CERT-UXDES-2025-LSA-001.pdf',
    NOW() - INTERVAL '5 days'
  );
