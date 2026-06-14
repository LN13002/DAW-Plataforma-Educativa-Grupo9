import { useEffect, useMemo, useState } from 'react'
import {
  ADMIN_ONLY_VIEWS,
  DEFAULT_USER,
  LEARNER_ONLY_VIEWS,
  STAFF_ONLY_VIEWS,
} from '../constants/app'
import { api, mapCategoryDto, mapCertificateDto, mapCourseDto, mapLessonDto } from '../services/api'
import { courseProgress, normalizeRole, roleLabel, toAppUser } from '../utils/learning'

function buildPersonaOptions(users) {
  const seenRoles = new Set()

  return users
    .filter((user) => {
      const role = normalizeRole(user.role)
      if (!role || seenRoles.has(role)) return false
      seenRoles.add(role)
      return true
    })
    .map((user) => ({
      id: user.id,
      role: normalizeRole(user.role),
      roleLabel: roleLabel(user.role),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      initials: `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase(),
    }))
}

function mapReviewsForDashboard(reviews) {
  return reviews.map((review, index) => ({
    name: review.userName ?? `Estudiante ${index + 1}`,
    rating: review.rating,
    text: review.body ?? 'El estudiante aún no agregó un comentario escrito.',
  }))
}

function mapCertificatesForEnrollments(certificates, enrollments) {
  const enrollmentIds = new Set(enrollments.map((enrollment) => enrollment.id))
  return certificates
    .filter((certificate) => enrollmentIds.has(certificate.enrollmentId))
    .map(mapCertificateDto)
}

function getFirstCourseLesson(course, modules, lessons) {
  const courseModuleIds = new Set(modules.filter((module) => module.courseId === course?.id).map((module) => module.id))
  return lessons.find((lesson) => courseModuleIds.has(lesson.moduleId) && lesson.status !== 'locked')
    ?? lessons.find((lesson) => courseModuleIds.has(lesson.moduleId))
}

export function useLearningPlatform() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [authView, setAuthView] = useState('login')
  const [view, setView] = useState('home')
  const [appUser, setAppUser] = useState(DEFAULT_USER)
  const [appUsers, setAppUsers] = useState([])
  const [appCourses, setAppCourses] = useState([])
  const [appCategories, setAppCategories] = useState(['Todos'])
  const [appLessons, setAppLessons] = useState([])
  const [appCertificates, setAppCertificates] = useState([])
  const [appModules, setAppModules] = useState([])
  const [appEnrollments, setAppEnrollments] = useState([])
  const [backendCourses, setBackendCourses] = useState([])
  const [backendCertificates, setBackendCertificates] = useState([])
  const [appReviews, setAppReviews] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeResourceKey, setActiveResourceKey] = useState('users')
  const [completedMessage, setCompletedMessage] = useState('')
  const [dataNotice, setDataNotice] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadBackendData() {
      try {
        const [
          usersDto,
          coursesDto,
          categoriesDto,
          modulesDto,
          lessonsDto,
          enrollmentsDto,
          certificatesDto,
          reviewsDto,
        ] = await Promise.all([
          api.getUsers(),
          api.getCourses(),
          api.getCategories(),
          api.getModules(),
          api.getLessons(),
          api.getEnrollments(),
          api.getCertificates(),
          api.getReviews(),
        ])

        if (!mounted) return

        const student = usersDto.find((user) => normalizeRole(user.role) === 'student') ?? usersDto[0]
        const currentUserEnrollments = student ? enrollmentsDto.filter((enrollment) => enrollment.userId === student.id) : []
        const mappedCourses = coursesDto.map((course, index) => mapCourseDto(course, index, currentUserEnrollments))
        const mappedCategories = categoriesDto.map(mapCategoryDto)
        const mappedLessons = lessonsDto.map((lesson) => mapLessonDto(lesson))

        setAppUsers(usersDto)
        setBackendCourses(coursesDto)
        setBackendCertificates(certificatesDto)
        if (student) setAppUser(toAppUser(student))
        if (mappedCourses.length > 0) {
          setAppCourses(mappedCourses)
          setSelectedCourse((current) => mappedCourses.find((course) => course.id === current?.id) ?? mappedCourses[0])
        }

        setAppCategories(['Todos', ...mappedCategories.map((category) => category.name)])
        if (mappedLessons.length > 0) {
          setAppLessons(mappedLessons)
          setActiveLesson(mappedLessons.find((lesson) => lesson.status === 'active') ?? mappedLessons[0])
        }
        setAppCertificates(mapCertificatesForEnrollments(certificatesDto, currentUserEnrollments))
        setAppModules(modulesDto)
        setAppEnrollments(enrollmentsDto)
        setAppReviews(mapReviewsForDashboard(reviewsDto))
        setDataNotice('')
      } catch {
        if (mounted) setDataNotice('No se pudo conectar con los datos de la plataforma.')
      }
    }

    loadBackendData()

    return () => {
      mounted = false
    }
  }, [])

  const personaOptions = useMemo(() => buildPersonaOptions(appUsers), [appUsers])

  const filteredCourses = useMemo(() => {
    if (activeCategory === 'Todos') return appCourses
    return appCourses.filter((course) => course.category === activeCategory)
  }, [activeCategory, appCourses])

  const isAdminView = appUser.plan === 'admin'
  const isInstructorView = appUser.plan === 'instructor'
  const instructorCourses = isInstructorView
    ? appCourses.filter((course) => course.instructorId === appUser.id)
    : []
  const visibleExploreCourses = isInstructorView ? instructorCourses : filteredCourses
  const visibleCertificates = isAdminView ? backendCertificates.map(mapCertificateDto) : appCertificates
  const instructorCourseIds = isInstructorView
    ? new Set(instructorCourses.map((course) => course.id))
    : null

  function clearCompletedMessage(delay = 3500) {
    window.setTimeout(() => setCompletedMessage(''), delay)
  }

  function canAccessView(nextView) {
    if (ADMIN_ONLY_VIEWS.has(nextView)) return isAdminView
    if (STAFF_ONLY_VIEWS.has(nextView)) return isAdminView || isInstructorView
    if (LEARNER_ONLY_VIEWS.has(nextView)) return !isAdminView && !isInstructorView
    if (nextView === 'certificates') return isAdminView || !isInstructorView
    return true
  }

  function openCourse(course) {
    setSelectedCourse(course)
    setView('course')
  }

  function openPlayer(course = selectedCourse) {
    if (!course) return
    const firstCourseLesson = getFirstCourseLesson(course, appModules, appLessons)

    setSelectedCourse(course)
    if (!firstCourseLesson) {
      setCompletedMessage('Este curso aún no tiene lecciones publicadas.')
      setView('course')
      clearCompletedMessage()
      return
    }

    setActiveLesson(firstCourseLesson)
    setView('player')
  }

  function switchPersona(userId) {
    const user = appUsers.find((item) => item.id === userId)
    if (!user) return

    const role = normalizeRole(user.role)
    const userEnrollments = appEnrollments.filter((enrollment) => enrollment.userId === user.id)
    const nextCourses = backendCourses.map((course, index) => mapCourseDto(course, index, userEnrollments))
    const nextCertificates = mapCertificatesForEnrollments(backendCertificates, userEnrollments)

    setAppUser(toAppUser(user))
    setAppCourses(nextCourses)
    setAppCertificates(nextCertificates)
    setSelectedCourse((current) => nextCourses.find((course) => course.id === current?.id) ?? nextCourses[0] ?? null)
    if (role === 'admin' && ['progress', 'library', 'player'].includes(view)) setView('home')
    if (role === 'instructor' && ['certificates', 'progress', 'library', 'player'].includes(view)) setView('home')
    if (ADMIN_ONLY_VIEWS.has(view) && role !== 'admin') setView('home')
    if (STAFF_ONLY_VIEWS.has(view) && role !== 'admin' && role !== 'instructor') setView('home')
    setCompletedMessage(`Viendo como ${roleLabel(user.role)}: ${user.firstName} ${user.lastName}`)
    clearCompletedMessage(2500)
  }

  async function refreshCurrentUserLearningState({ issueCertificateForEnrollmentId } = {}) {
    const [enrollmentsDto, certificatesDto] = await Promise.all([
      api.getEnrollments(),
      api.getCertificates(),
    ])

    let nextCertificatesDto = certificatesDto
    const currentUserEnrollments = appUser?.id
      ? enrollmentsDto.filter((enrollment) => enrollment.userId === appUser.id)
      : []

    if (issueCertificateForEnrollmentId) {
      const completedEnrollment = currentUserEnrollments.find((enrollment) => enrollment.id === issueCertificateForEnrollmentId)
      const alreadyCertified = certificatesDto.some((certificate) => certificate.enrollmentId === issueCertificateForEnrollmentId)

      if (completedEnrollment && Number(completedEnrollment.progress ?? 0) >= 100 && !alreadyCertified) {
        try {
          const createdCertificate = await api.createCertificate({ enrollmentId: issueCertificateForEnrollmentId })
          nextCertificatesDto = [...certificatesDto, createdCertificate]
        } catch {
          nextCertificatesDto = await api.getCertificates()
        }
      }
    }

    const nextCourses = backendCourses.map((course, index) => mapCourseDto(course, index, currentUserEnrollments))
    const nextCertificates = mapCertificatesForEnrollments(nextCertificatesDto, currentUserEnrollments)

    setAppEnrollments(enrollmentsDto)
    setBackendCertificates(nextCertificatesDto)
    setAppCourses(nextCourses)
    setAppCertificates(nextCertificates)
    setSelectedCourse((current) => nextCourses.find((course) => course.id === current?.id) ?? current)

    return nextCourses.find((course) => course.id === selectedCourse?.id)
  }

  async function markCompleted() {
    if (!selectedCourse?.enrollmentId || !activeLesson?.id) {
      setCompletedMessage('Lección marcada localmente. Inscríbete al curso para guardar el progreso en tu cuenta.')
      clearCompletedMessage()
      return
    }

    try {
      await api.upsertLessonProgress({
        enrollmentId: selectedCourse.enrollmentId,
        lessonId: activeLesson.id,
        secondsWatched: activeLesson.durationSeconds ?? 0,
        completed: true,
      })
      const updatedCourse = await refreshCurrentUserLearningState({
        issueCertificateForEnrollmentId: selectedCourse.enrollmentId,
      })
      const progress = Math.round(courseProgress(updatedCourse ?? selectedCourse))
      setCompletedMessage(`Lección completada. Progreso del curso actualizado a ${progress}%.`)
    } catch {
      setCompletedMessage('No se pudo guardar el progreso. Intenta de nuevo en unos segundos.')
    }

    clearCompletedMessage()
  }

  async function handleEnrollCourse(course) {
    if (!appUser?.id) {
      setCompletedMessage('No hay usuario activo para crear la inscripción.')
      return
    }

    if (course.enrollmentId) {
      openPlayer(course)
      return
    }

    try {
      const created = await api.createEnrollment({
        userId: appUser.id,
        courseId: course.id,
      })
      const nextEnrollments = [...appEnrollments, created]
      const nextCourses = appCourses.map((item) =>
        item.id === course.id
          ? {
              ...item,
              enrollmentId: created.id,
              enrollmentStatus: created.status,
              progress: Number(created.progress ?? 0),
            }
          : item
      )

      setAppEnrollments(nextEnrollments)
      setAppCourses(nextCourses)
      setSelectedCourse(nextCourses.find((item) => item.id === course.id) ?? course)
      setCompletedMessage('Inscripción creada correctamente.')
      setView('player')
    } catch {
      setCompletedMessage('No se pudo crear la inscripción. Revisa los datos del usuario e intenta de nuevo.')
    }

    clearCompletedMessage()
  }

  async function handleLogin(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (authView === 'create') {
      try {
        const createdUser = await api.createUser({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          password: formData.get('password'),
          avatarUrl: '',
          role: formData.get('role').toUpperCase(),
        })
        setAppUsers((current) => [...current, createdUser])
        setAppUser(toAppUser(createdUser))
      } catch {
        setDataNotice('No se pudo crear la cuenta. Revisa que la plataforma esté disponible.')
      }
    } else {
      try {
        const users = await api.getUsers()
        const email = formData.get('email')
        const foundUser = users.find((user) => user.email === email) ?? users[0]
        if (foundUser) {
          setAppUsers(users)
          setAppUser(toAppUser(foundUser))
        }
      } catch {
        setDataNotice('No se pudo iniciar sesión con esos datos.')
      }
    }

    setIsAuthenticated(true)
    setView('home')
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setAuthView('login')
    setView('home')
  }

  return {
    activeCategory,
    activeLesson,
    activeResourceKey,
    appCategories,
    appCourses,
    appEnrollments,
    appLessons,
    appModules,
    appReviews,
    appUser,
    appUsers,
    authView,
    canAccessView,
    completedMessage,
    dataNotice,
    handleEnrollCourse,
    handleLogin,
    handleLogout,
    instructorCourseIds,
    isAdminView,
    isAuthenticated,
    isInstructorView,
    markCompleted,
    openCourse,
    openPlayer,
    personaOptions,
    selectedCourse,
    setActiveCategory,
    setActiveLesson,
    setActiveResourceKey,
    setAuthView,
    setView,
    switchPersona,
    view,
    visibleCertificates,
    visibleExploreCourses,
  }
}
