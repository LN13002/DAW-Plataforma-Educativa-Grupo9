const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  // --- MÓDULO DE USUARIOS ---
  getUsers: () => request('/api/users'),
  createUser: (payload) =>
    request('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateUser: (id, payload) =>
    request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteUser: (id) =>
    request(`/api/users/${id}`, {
      method: 'DELETE',
    }),

  // --- MÓDULO DE CATEGORÍAS ---
  getCategories: () => request('/api/categories'),
  createCategory: (payload) =>
    request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateCategory: (id, payload) =>
    request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteCategory: (id) =>
    request(`/api/categories/${id}`, {
      method: 'DELETE',
    }),

  // --- RESTO DE RECURSOS ---
  getCourses: () => request('/api/courses'),
  getModules: () => request('/api/modules'),
  createModule: (payload) =>
    request('/api/modules', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateModule: (id, payload) =>
    request(`/api/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteModule: (id) =>
    request(`/api/modules/${id}`, {
      method: 'DELETE',
    }),
  getLessons: () => request('/api/lessons'),
  createLesson: (payload) =>
    request('/api/lessons', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateLesson: (id, payload) =>
    request(`/api/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteLesson: (id) =>
    request(`/api/lessons/${id}`, {
      method: 'DELETE',
    }),
  getEnrollments: () => request('/api/enrollments'),
  getEnrollmentsByUser: (userId) => request(`/api/enrollments/user/${userId}`),
  getCertificates: () => request('/api/certificates'),
  createCertificate: (payload) =>
    request('/api/certificates', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateCertificate: (id, payload) =>
    request(`/api/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteCertificate: (id) =>
    request(`/api/certificates/${id}`, {
      method: 'DELETE',
    }),

  getCertificateById: (id) =>
    request(`/api/certificates/${id}`),
  
  getReviews: () => request('/api/reviews'),
  getComments: () => request('/api/comments'),
  createComment: (payload) =>
    request('/api/comments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateComment: (id, payload) =>
    request(`/api/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteComment: (id) =>
    request(`/api/comments/${id}`, {
      method: 'DELETE',
    }),
  getLessonProgress: () => request('/api/lesson-progress'),
  deleteLessonProgress: (id) =>
    request(`/api/lesson-progress/${id}`, {
      method: 'DELETE',
    }),

  createEnrollment: (payload) =>
    request('/api/enrollments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateEnrollmentStatus: (id, payload) =>
    request(`/api/enrollments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteEnrollment: (id) =>
    request(`/api/enrollments/${id}`, {
      method: 'DELETE',
    }),

  upsertLessonProgress: (payload) =>
    request('/api/lesson-progress', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
]

function levelLabel(level) {
  const labels = {
    beginner: 'Inicial',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  }
  return labels[level] ?? level ?? 'General'
}

export function mapCourseDto(course, index = 0, enrollments = []) {
  const enrollment = enrollments.find((item) => item.courseId === course.id)
  return {
    id: course.id,
    title: course.title,
    instructor: course.instructorName ?? 'Instructor UES',
    instructorId: course.instructorId,
    category: course.categoryName ?? 'General',
    categoryId: course.categoryId,
    progress: Number(enrollment?.progress ?? 0),
    enrollmentId: enrollment?.id,
    enrollmentStatus: enrollment?.status,
    duration: 'Contenido bajo demanda',
    rating: 4.8,
    students: 0,
    price: 'Gratis',
    level: levelLabel(course.level),
    status: course.status,
    description: course.description ?? 'Curso disponible en la plataforma educativa UES Virtual.',
    image: course.thumbnailUrl || fallbackImages[index % fallbackImages.length],
  }
}

// CORRECCIÓN IMPORTANTE: Ahora devuelve un objeto con ID para poder editar/borrar
export function mapCategoryDto(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parent?.id || null
  }
}

export function mapLessonDto(lesson, activeLessonId) {
  const minutes = Math.max(1, Math.round((lesson.durationSeconds ?? 0) / 60))
  return {
    id: lesson.id,
    moduleId: lesson.moduleId,
    title: `${lesson.position}. ${lesson.title}`,
    rawTitle: lesson.title,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    duration: `${minutes} min`,
    durationSeconds: lesson.durationSeconds ?? 0,
    type: lesson.type,
    preview: lesson.preview,
    published: lesson.published,
    status: lesson.id === activeLessonId ? 'active' : lesson.published ? 'available' : 'locked',
  }
}

export function mapCertificateDto(certificate) {
  return {
    id: certificate.id,
    code: certificate.code,
    title: certificate.courseTitle ? `Certificado de ${certificate.courseTitle}` : `Certificado ${certificate.code ?? ''}`.trim(),
    studentName: certificate.studentName,
    courseTitle: certificate.courseTitle,
    issuedAt: certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString('es-SV') : 'Pendiente',
    pdfUrl: certificate.pdfUrl,
    downloadUrl: `/api/certificates/${certificate.id}/download`,
    enrollmentId: certificate.enrollmentId,
  }
}
