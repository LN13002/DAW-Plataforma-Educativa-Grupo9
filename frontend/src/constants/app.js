export const DEFAULT_USER = {
  id: '',
  name: 'Usuario',
  initials: 'US',
  faculty: 'Usuario registrado en UES Virtual',
  email: '',
  plan: 'student',
  streak: 0,
}

export const PLAYER_RESOURCES = ['Guía de estudio', 'Ejercicios prácticos', 'Material complementario']
export const COURSE_PRICE_LABEL = 'Gratis'

export const BACKEND_RESOURCES = [
  { key: 'users', title: 'Usuarios', subtitle: 'Personas y roles', icon: 'group' },
  { key: 'courses', title: 'Cursos', subtitle: 'Catálogo académico', icon: 'school' },
  { key: 'categories', title: 'Categorías', subtitle: 'Áreas de conocimiento', icon: 'category' },
  { key: 'modules', title: 'Módulos', subtitle: 'Estructura de cursos', icon: 'view_module' },
  { key: 'lessons', title: 'Lecciones', subtitle: 'Clases y recursos', icon: 'play_lesson' },
  { key: 'enrollments', title: 'Inscripciones', subtitle: 'Estudiantes inscritos', icon: 'how_to_reg' },
  { key: 'comments', title: 'Comentarios', subtitle: 'Conversaciones de clase', icon: 'forum' },
  { key: 'certificates', title: 'Certificados', subtitle: 'Diplomas emitidos', icon: 'workspace_premium' },
]

export const DEDICATED_RESOURCE_VIEWS = new Set([
  'users',
  'categories',
  'modules',
  'comments',
  'enrollments',
  'lessons',
  'lesson-progress',
  'certificates',
])

export const ADMIN_ONLY_VIEWS = new Set(['users', 'categories', 'comments', 'enrollments', 'lesson-progress', 'admin'])
export const STAFF_ONLY_VIEWS = new Set(['modules', 'lessons'])
export const LEARNER_ONLY_VIEWS = new Set(['library', 'progress', 'player'])
