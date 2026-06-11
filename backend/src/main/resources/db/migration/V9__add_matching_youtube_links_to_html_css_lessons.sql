UPDATE lessons l
SET video_url = v.video_url,
    type = 'video',
    is_published = TRUE
FROM modules m
JOIN courses c ON c.id = m.course_id
JOIN (
    VALUES
      ('Introducción a HTML', 'Cómo Funciona la Web', 'https://www.youtube.com/embed/hJHvdBlSxug'),
      ('Introducción a HTML', 'Tu Primer Documento HTML', 'https://www.youtube.com/embed/UB1O30fR-EE'),
      ('Introducción a HTML', 'Elementos Semánticos de HTML', 'https://www.youtube.com/embed/kGW8Al_cga4'),
      ('Introducción a HTML', 'Formularios y Campos en HTML', 'https://www.youtube.com/embed/fNcJuPIZ2WE'),
      ('Estilos con CSS', 'Selectores y Especificidad en CSS', 'https://www.youtube.com/embed/l1mER1bV0N0'),
      ('Estilos con CSS', 'El Modelo de Caja', 'https://www.youtube.com/embed/rIO5326FgPE'),
      ('Estilos con CSS', 'Diseño con Flexbox', 'https://www.youtube.com/embed/phWxA89Dy94'),
      ('Estilos con CSS', 'Diseño con CSS Grid', 'https://www.youtube.com/embed/jV8B24rSN5o'),
      ('Construcción de un Proyecto Real', 'Construcción de la Página de Portafolio', 'https://www.youtube.com/embed/r_hYR53r61M'),
      ('Construcción de un Proyecto Real', 'Haciéndolo Responsivo', 'https://www.youtube.com/embed/bn-DQznsbIMk')
) AS v(module_title, lesson_title, video_url)
  ON v.module_title = m.title
WHERE l.module_id = m.id
  AND c.title = 'Fundamentos de HTML y CSS'
  AND l.title = v.lesson_title;
