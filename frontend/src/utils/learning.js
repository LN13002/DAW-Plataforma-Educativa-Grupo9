import { DEFAULT_USER } from '../constants/app'

export function normalizeRole(role) {
  const normalized = String(role ?? '').toLowerCase()
  return normalized === 'teacher' ? 'instructor' : normalized
}

export function roleLabel(role) {
  const labels = {
    admin: 'Administrador',
    instructor: 'Instructor',
    student: 'Estudiante',
  }
  return labels[normalizeRole(role)] ?? role ?? 'Estudiante'
}

export function courseProgress(course) {
  return Number(course?.progress ?? 0)
}

export function getLearnerStats(courses, certificates = []) {
  const enrolledCourses = courses.filter((course) => course.enrollmentId)
  const inProgressCourses = enrolledCourses.filter((course) => courseProgress(course) < 100)
  const completedCourses = enrolledCourses.filter((course) => courseProgress(course) >= 100)
  const nextCourse = [...inProgressCourses].sort((a, b) => courseProgress(b) - courseProgress(a))[0] ?? null

  return {
    enrolledCourses,
    inProgressCourses,
    completedCourses,
    certificatesCount: certificates.length,
    nextCourse,
  }
}

export function getInstructorScope(user, courses, modules, lessons, enrollments) {
  const assignedCourses = courses.filter((course) => course.instructorId === user.id)
  const assignedCourseIds = new Set(assignedCourses.map((course) => course.id))
  const assignedModules = modules.filter((module) => assignedCourseIds.has(module.courseId))
  const assignedModuleIds = new Set(assignedModules.map((module) => module.id))
  const assignedLessons = lessons.filter((lesson) => assignedModuleIds.has(lesson.moduleId))
  const assignedEnrollments = enrollments.filter((enrollment) => assignedCourseIds.has(enrollment.courseId))

  return {
    assignedCourses,
    assignedModules,
    assignedLessons,
    assignedEnrollments,
  }
}

export function toAppUser(user) {
  if (!user) return DEFAULT_USER
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    initials: `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase(),
    faculty: 'Usuario registrado en UES Virtual',
    email: user.email,
    plan: normalizeRole(user.role),
    streak: 0,
  }
}
