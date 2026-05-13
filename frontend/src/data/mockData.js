export const currentUser = {
  name: 'Mateo Alejandro Rivas',
  initials: 'MR',
  faculty: 'Facultad de Ingenieria y Arquitectura',
  email: 'mateo.rivas@ues.edu.sv',
  plan: 'Premium Plus',
  streak: 12,
}

export const courses = [
  {
    id: 1,
    title: 'Quantum Computing: Fundamentos y Aplicaciones',
    instructor: 'Dra. Elena Rodriguez',
    category: 'Ingenieria y Sistemas',
    progress: 65,
    duration: '42h',
    rating: 4.9,
    students: 8540,
    price: 'Gratis',
    level: 'Intermedio',
    description:
      'Explora las bases de la mecanica cuantica aplicada a la computacion moderna, algoritmos avanzados y casos de uso academicos.',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'Introduccion a la Ciberseguridad Institucional',
    instructor: 'Dr. Ricardo Mendez',
    category: 'Tecnologia',
    progress: 30,
    duration: '24h',
    rating: 4.8,
    students: 1240,
    price: 'Gratis',
    level: 'Inicial',
    description:
      'Aprende fundamentos de seguridad institucional, gestion de riesgos, buenas practicas y defensa de servicios academicos.',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'Bioquimica Clinica Aplicada',
    instructor: 'Dra. Josefa Martinez',
    category: 'Ciencias de la Salud',
    progress: 0,
    duration: '40h',
    rating: 5.0,
    students: 420,
    price: '$19.99',
    level: 'Avanzado',
    description:
      'Curso practico sobre analisis clinico, procesos de laboratorio y lectura de resultados para ciencias de la salud.',
    image:
      'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Digital Transformation Strategy',
    instructor: 'Dr. Alejandro Mejia',
    category: 'Economia y Finanzas',
    progress: 0,
    duration: '35h',
    rating: 4.9,
    students: 15420,
    price: '$49.99',
    level: 'Profesional',
    description:
      'Domina estrategia, innovacion, datos y liderazgo para dirigir transformaciones digitales en organizaciones modernas.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'Literatura Latinoamericana del Siglo XX',
    instructor: 'Lic. Maria Elena Valle',
    category: 'Artes y Letras',
    progress: 0,
    duration: '15h',
    rating: 4.7,
    students: 850,
    price: 'Gratis',
    level: 'Inicial',
    description:
      'Un recorrido por autores, movimientos, contexto historico y analisis critico de textos latinoamericanos esenciales.',
    image:
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    title: 'Analisis Macroeconomico Moderno',
    instructor: 'Msc. Alberto Duran',
    category: 'Economia y Finanzas',
    progress: 0,
    duration: '30h',
    rating: 4.8,
    students: 1120,
    price: '$29.99',
    level: 'Intermedio',
    description:
      'Comprende indicadores, ciclos economicos, politicas publicas y modelos de decision en contextos cambiantes.',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
  },
]

export const categories = [
  'Ingenieria y Sistemas',
  'Artes y Letras',
  'Ciencias de la Salud',
  'Economia y Finanzas',
  'Derecho',
  'Idiomas',
]

export const lessons = [
  {
    id: 1,
    title: '4.1 Introduccion a Microservicios',
    duration: '12 min',
    status: 'completed',
  },
  {
    id: 2,
    title: '4.2 Implementacion de API Gateway',
    duration: '18 min',
    status: 'active',
  },
  {
    id: 3,
    title: '4.3 Comunicacion via RabbitMQ',
    duration: '25 min',
    status: 'available',
  },
  {
    id: 4,
    title: '4.4 Despliegue en Kubernetes',
    duration: '32 min',
    status: 'locked',
  },
]

export const modules = [
  {
    title: 'Modulo 1: Fundamentos de la Era Digital',
    meta: '4 clases • 45 min',
    lessons: ['Introduccion a la economia digital', 'La cuarta revolucion industrial'],
  },
  {
    title: 'Modulo 2: Tecnologias Exponenciales',
    meta: '6 clases • 1h 20min',
    lessons: ['Inteligencia Artificial aplicada', 'Big Data para toma de decisiones'],
  },
  {
    title: 'Modulo 3: Liderazgo y Gestion del Cambio',
    meta: '5 clases • 55 min',
    lessons: ['Cultura de innovacion', 'Gestion de resistencia al cambio'],
  },
]

export const certificates = [
  {
    id: 'UES-48292',
    title: 'Fundamentos de Redes IP',
    issuedAt: '12 de Mayo, 2024',
  },
  {
    id: 'UES-31094',
    title: 'Seguridad Informatica I',
    issuedAt: '28 de Abril, 2024',
  },
  {
    id: 'UES-99281',
    title: 'Ingenieria de Software II',
    issuedAt: '15 de Marzo, 2024',
  },
]

export const reviews = [
  {
    name: 'Ricardo Martinez',
    rating: 5,
    text: 'El contenido es practico y las herramientas se pueden aplicar directamente en proyectos academicos.',
  },
  {
    name: 'Laura Castillo',
    rating: 4,
    text: 'Excelente curso. Algunos modulos son densos, pero el material de apoyo ayuda mucho.',
  },
]

export const resources = [
  'Lecture Slides.pdf',
  'Guia de laboratorio.pdf',
  'Repositorio de ejemplo',
  'Bibliografia complementaria',
]

export const backendResources = [
  {
    key: 'users',
    title: 'Usuarios',
    endpoint: '/api/users',
    icon: 'group',
    description: 'Estudiantes, instructores y administradores registrados.',
    fields: ['firstName', 'lastName', 'email', 'role', 'active'],
    records: [
      { id: 'USR-001', firstName: 'Mateo', lastName: 'Rivas', email: 'mateo.rivas@ues.edu.sv', role: 'student', active: 'true' },
      { id: 'USR-002', firstName: 'Elena', lastName: 'Rodriguez', email: 'elena.rodriguez@ues.edu.sv', role: 'instructor', active: 'true' },
      { id: 'USR-003', firstName: 'Admin', lastName: 'UES', email: 'admin@ues.edu.sv', role: 'admin', active: 'true' },
    ],
  },
  {
    key: 'courses',
    title: 'Cursos',
    endpoint: '/api/courses',
    icon: 'school',
    description: 'Catalogo de cursos con instructor, categoria, nivel y estado.',
    fields: ['title', 'level', 'status', 'instructorName', 'categoryName'],
    records: [
      { id: 'CRS-001', title: 'Quantum Computing', level: 'intermediate', status: 'published', instructorName: 'Dra. Elena Rodriguez', categoryName: 'Ingenieria' },
      { id: 'CRS-002', title: 'Ciberseguridad Institucional', level: 'beginner', status: 'published', instructorName: 'Dr. Ricardo Mendez', categoryName: 'Tecnologia' },
      { id: 'CRS-003', title: 'Bioquimica Clinica', level: 'advanced', status: 'draft', instructorName: 'Dra. Josefa Martinez', categoryName: 'Salud' },
    ],
  },
  {
    key: 'categories',
    title: 'Categorias',
    endpoint: '/api/categories',
    icon: 'category',
    description: 'Areas academicas y jerarquias por slug.',
    fields: ['name', 'slug', 'description', 'parent'],
    records: [
      { id: 'CAT-001', name: 'Ingenieria y Sistemas', slug: 'ingenieria-sistemas', description: 'Cursos tecnicos y de software', parent: '-' },
      { id: 'CAT-002', name: 'Ciencias de la Salud', slug: 'salud', description: 'Medicina, laboratorio y salud publica', parent: '-' },
      { id: 'CAT-003', name: 'Economia y Finanzas', slug: 'economia-finanzas', description: 'Gestion, mercado y datos', parent: '-' },
    ],
  },
  {
    key: 'modules',
    title: 'Modulos',
    endpoint: '/api/modules',
    icon: 'view_module',
    description: 'Bloques de contenido ordenados dentro de cada curso.',
    fields: ['courseTitle', 'title', 'position', 'published'],
    records: [
      { id: 'MOD-001', courseTitle: 'Quantum Computing', title: 'Fundamentos', position: '1', published: 'true' },
      { id: 'MOD-002', courseTitle: 'Quantum Computing', title: 'Algoritmos cuanticos', position: '2', published: 'true' },
      { id: 'MOD-003', courseTitle: 'Ciberseguridad', title: 'Gestion de riesgos', position: '1', published: 'false' },
    ],
  },
  {
    key: 'lessons',
    title: 'Lecciones',
    endpoint: '/api/lessons',
    icon: 'play_lesson',
    description: 'Videos, articulos y quizzes con posicion, preview y publicacion.',
    fields: ['moduleId', 'title', 'type', 'durationSeconds', 'published'],
    records: [
      { id: 'LES-001', moduleId: 'MOD-001', title: 'Introduccion', type: 'video', durationSeconds: '750', published: 'true' },
      { id: 'LES-002', moduleId: 'MOD-001', title: 'Lectura guiada', type: 'article', durationSeconds: '300', published: 'true' },
      { id: 'LES-003', moduleId: 'MOD-002', title: 'Quiz diagnostico', type: 'quiz', durationSeconds: '600', published: 'false' },
    ],
  },
  {
    key: 'enrollments',
    title: 'Inscripciones',
    endpoint: '/api/enrollments',
    icon: 'assignment_ind',
    description: 'Relacion estudiante-curso, estado y porcentaje de avance.',
    fields: ['studentName', 'courseTitle', 'status', 'progress', 'enrolledAt'],
    records: [
      { id: 'ENR-001', studentName: 'Mateo Rivas', courseTitle: 'Quantum Computing', status: 'active', progress: '65.00', enrolledAt: '2024-05-12' },
      { id: 'ENR-002', studentName: 'Maria Lopez', courseTitle: 'Ciberseguridad', status: 'completed', progress: '100.00', enrolledAt: '2024-04-20' },
      { id: 'ENR-003', studentName: 'Jorge Rodriguez', courseTitle: 'Bioquimica', status: 'cancelled', progress: '8.00', enrolledAt: '2024-03-18' },
    ],
  },
  {
    key: 'lesson-progress',
    title: 'Progreso de lecciones',
    endpoint: '/api/lesson-progress',
    icon: 'track_changes',
    description: 'Seguimiento granular por inscripcion y leccion.',
    fields: ['enrollmentId', 'lessonId', 'completed', 'secondsWatched', 'lastWatchedAt'],
    records: [
      { id: 'LPR-001', enrollmentId: 'ENR-001', lessonId: 'LES-001', completed: 'true', secondsWatched: '750', lastWatchedAt: '2024-05-18' },
      { id: 'LPR-002', enrollmentId: 'ENR-001', lessonId: 'LES-002', completed: 'false', secondsWatched: '260', lastWatchedAt: '2024-05-19' },
      { id: 'LPR-003', enrollmentId: 'ENR-002', lessonId: 'LES-001', completed: 'true', secondsWatched: '750', lastWatchedAt: '2024-04-28' },
    ],
  },
  {
    key: 'certificates',
    title: 'Certificados',
    endpoint: '/api/certificates',
    icon: 'verified',
    description: 'Certificados emitidos por inscripcion completada.',
    fields: ['enrollmentId', 'code', 'pdfUrl', 'issuedAt'],
    records: [
      { id: 'CER-001', enrollmentId: 'ENR-002', code: 'UES-48292', pdfUrl: '/certificates/ues-48292.pdf', issuedAt: '2024-05-12' },
      { id: 'CER-002', enrollmentId: 'ENR-004', code: 'UES-31094', pdfUrl: '/certificates/ues-31094.pdf', issuedAt: '2024-04-28' },
      { id: 'CER-003', enrollmentId: 'ENR-005', code: 'UES-99281', pdfUrl: '/certificates/ues-99281.pdf', issuedAt: '2024-03-15' },
    ],
  },
  {
    key: 'reviews',
    title: 'Resenas',
    endpoint: '/api/reviews',
    icon: 'reviews',
    description: 'Calificaciones y comentarios por usuario y curso.',
    fields: ['userId', 'courseId', 'rating', 'body', 'createdAt'],
    records: [
      { id: 'REV-001', userId: 'USR-001', courseId: 'CRS-001', rating: '5', body: 'Muy practico', createdAt: '2024-05-16' },
      { id: 'REV-002', userId: 'USR-004', courseId: 'CRS-002', rating: '4', body: 'Buen material', createdAt: '2024-05-10' },
      { id: 'REV-003', userId: 'USR-005', courseId: 'CRS-004', rating: '5', body: 'Excelente instructor', createdAt: '2024-04-29' },
    ],
  },
  {
    key: 'comments',
    title: 'Comentarios',
    endpoint: '/api/comments',
    icon: 'forum',
    description: 'Discusion por leccion con respuestas anidadas y likes.',
    fields: ['userId', 'lessonId', 'parentId', 'content', 'likes'],
    records: [
      { id: 'COM-001', userId: 'USR-001', lessonId: 'LES-002', parentId: '-', content: 'Tengo duda sobre el gateway', likes: '4' },
      { id: 'COM-002', userId: 'USR-002', lessonId: 'LES-002', parentId: 'COM-001', content: 'Revisa el recurso 2', likes: '8' },
      { id: 'COM-003', userId: 'USR-004', lessonId: 'LES-001', parentId: '-', content: 'Muy clara la explicacion', likes: '2' },
    ],
  },
]
