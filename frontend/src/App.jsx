import { useEffect, useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Button } from './components/Button'
import { CategoryPills } from './components/CategoryPills'
import { CourseCard } from './components/CourseCard'
import { Icon } from './components/Icon'
import { LessonList } from './components/LessonList'
import { ProgressBar } from './components/ProgressBar'
import { StatCard } from './components/StatCard'
import { VideoPlayerCard } from './components/VideoPlayerCard'
import { api, mapCategoryDto, mapCertificateDto, mapCourseDto, mapLessonDto } from './services/api'
import { ModulesPage } from './pages/modules/ModulesPage'
import { CommentsPage } from './pages/comments/CommentsPage'
import { LessonsPage } from './pages/lessons/LessonsPage'
import { LessonProgressPage } from './pages/lesson-progress/LessonProgressPage'
import { EnrollmentsPage } from './pages/enrollments/EnrollmentsPage'
import { UsersPage } from './pages/users/UsersPage'
import { CertificatesPage } from './pages/certificates/CertificatesPage'
import { CategoriesPage } from './pages/categories/CategoriesPage'

const DEFAULT_USER = {
  id: '',
  name: 'Usuario',
  initials: 'US',
  faculty: 'Usuario registrado en UES Virtual',
  email: '',
  plan: 'student',
  streak: 0,
}

const PLAYER_RESOURCES = ['Slides del tema', 'Guia de laboratorio', 'Repositorio de ejemplo']
const COURSE_PRICE_LABEL = 'Gratis'

const BACKEND_RESOURCES = [
  { key: 'users', title: 'Usuarios', endpoint: '/api/users', icon: 'group' },
  { key: 'courses', title: 'Cursos', endpoint: '/api/courses', icon: 'school' },
  { key: 'categories', title: 'Categorias', endpoint: '/api/categories', icon: 'category' },
  { key: 'modules', title: 'Modulos', endpoint: '/api/modules', icon: 'view_module' },
  { key: 'lessons', title: 'Lecciones', endpoint: '/api/lessons', icon: 'play_lesson' },
  { key: 'enrollments', title: 'Inscripciones', endpoint: '/api/enrollments', icon: 'how_to_reg' },
  { key: 'comments', title: 'Comentarios', endpoint: '/api/comments', icon: 'forum' },
  { key: 'certificates', title: 'Certificados', endpoint: '/api/certificates', icon: 'workspace_premium' },
]

const DEDICATED_RESOURCE_VIEWS = new Set([
  'users',
  'categories',
  'modules',
  'comments',
  'enrollments',
  'lessons',
  'lesson-progress',
  'certificates',
])
// Vistas exclusivas para administrador
const ADMIN_ONLY_VIEWS = new Set(['users', 'categories', 'comments', 'enrollments', 'lesson-progress', 'admin'])
// Vistas accesibles para admin e instructor (con filtrado por cursos propios para instructor)
const STAFF_ONLY_VIEWS = new Set(['modules', 'lessons'])

function normalizeRole(role) {
  return String(role ?? '').toLowerCase()
}

function roleLabel(role) {
  const labels = {
    admin: 'Admin',
    instructor: 'Instructor',
    student: 'User',
  }
  return labels[normalizeRole(role)] ?? role ?? 'User'
}

function courseProgress(course) {
  return Number(course?.progress ?? 0)
}

function getLearnerStats(courses, certificates = []) {
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

function getInstructorScope(user, courses, modules, lessons, enrollments) {
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

function toAppUser(user) {
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

function App() {
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
        const currentEnrollmentIds = new Set(currentUserEnrollments.map((enrollment) => enrollment.id))
        const mappedCourses = coursesDto.map((course, index) => mapCourseDto(course, index, currentUserEnrollments))
        const mappedCategories = categoriesDto.map(mapCategoryDto)
        const mappedLessons = lessonsDto.map((lesson) => mapLessonDto(lesson))
        const mappedCertificates = certificatesDto
          .filter((certificate) => currentEnrollmentIds.has(certificate.enrollmentId))
          .map(mapCertificateDto)

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
        setAppCertificates(mappedCertificates)
        setAppModules(modulesDto)
        setAppEnrollments(enrollmentsDto)
        setAppReviews(reviewsDto.map((review, index) => ({
          name: `Usuario ${index + 1}`,
          rating: review.rating,
          text: review.body ?? 'Sin comentario',
        })))

        setDataNotice('')
      } catch {
        if (mounted) {
          setDataNotice('No se pudo cargar la API del backend.')
        }
      }
    }

    loadBackendData()

    return () => {
      mounted = false
    }
  }, [])

  const personaOptions = useMemo(() => {
    const seenRoles = new Set()
    return appUsers
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
  }, [appUsers])

  const switchPersona = (userId) => {
    const user = appUsers.find((item) => item.id === userId)
    if (!user) return
    const role = normalizeRole(user.role)

    const userEnrollments = appEnrollments.filter((enrollment) => enrollment.userId === user.id)
    const enrollmentIds = new Set(userEnrollments.map((enrollment) => enrollment.id))
    const nextCourses = backendCourses.map((course, index) => mapCourseDto(course, index, userEnrollments))
    const nextCertificates = backendCertificates
      .filter((certificate) => enrollmentIds.has(certificate.enrollmentId))
      .map(mapCertificateDto)

    setAppUser(toAppUser(user))
    setAppCourses(nextCourses)
    setAppCertificates(nextCertificates)
    setSelectedCourse((current) => nextCourses.find((course) => course.id === current?.id) ?? nextCourses[0] ?? null)
    if (role === 'admin' && view === 'progress') setView('home')
    if (role === 'instructor' && ['certificates', 'progress', 'library', 'player'].includes(view)) setView('home')
    if (ADMIN_ONLY_VIEWS.has(view) && role !== 'admin') setView('home')
    if (STAFF_ONLY_VIEWS.has(view) && role !== 'admin' && role !== 'instructor') setView('home')
    setCompletedMessage(`Viendo como ${roleLabel(user.role)}: ${user.firstName} ${user.lastName}`)
    window.setTimeout(() => setCompletedMessage(''), 2500)
  }

  const filteredCourses = useMemo(() => {
    if (activeCategory === 'Todos') return appCourses
    return appCourses.filter((course) => course.category === activeCategory)
  }, [activeCategory, appCourses])

  const openCourse = (course) => {
    setSelectedCourse(course)
    setView('course')
  }

  const openPlayer = (course = selectedCourse) => {
    setSelectedCourse(course)
    setView('player')
  }

  const markCompleted = async () => {
    if (selectedCourse?.enrollmentId && activeLesson?.id) {
      try {
        await api.upsertLessonProgress({
          enrollmentId: selectedCourse.enrollmentId,
          lessonId: activeLesson.id,
          secondsWatched: activeLesson.durationSeconds ?? 0,
          completed: true,
        })
        setCompletedMessage('Leccion marcada como completada en el backend.')
      } catch {
        setCompletedMessage('No se pudo actualizar el progreso en la API.')
      }
    } else {
      setCompletedMessage('Leccion marcada localmente. Inscribete al curso para guardar progreso real.')
    }

    window.setTimeout(() => setCompletedMessage(''), 3500)
  }

  const handleEnrollCourse = async (course) => {
    if (!appUser?.id) {
      setCompletedMessage('No hay usuario activo para crear la inscripcion.')
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
      setAppEnrollments(nextEnrollments)
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
      setAppCourses(nextCourses)
      const updatedCourse = nextCourses.find((item) => item.id === course.id) ?? course
      setSelectedCourse(updatedCourse)
      setCompletedMessage('Inscripcion creada correctamente en el backend.')
      setView('player')
    } catch {
      setCompletedMessage('No se pudo crear la inscripcion. Revisa backend y datos del usuario.')
    }

    window.setTimeout(() => setCompletedMessage(''), 3500)
  }

  const handleLogin = async (event) => {
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
        setDataNotice('No se pudo crear la cuenta en la API. Entrando en modo demo.')
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
        setDataNotice('No se pudo autenticar contra la API.')
      }
    }
    setIsAuthenticated(true)
    setView('home')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAuthView('login')
    setView('home')
  }

  if (!isAuthenticated) {
    return (
      <AuthView
        mode={authView}
        onModeChange={setAuthView}
        onSubmit={handleLogin}
      />
    )
  }

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

  const canAccessView = (v) => {
    if (ADMIN_ONLY_VIEWS.has(v)) return isAdminView
    if (STAFF_ONLY_VIEWS.has(v)) return isAdminView || isInstructorView
    return true
  }

  const screenByView = {
    modules: <ModulesPage allowedCourseIds={instructorCourseIds} />,
    comments: <CommentsPage />,
    enrollments: <EnrollmentsPage />,
    lessons: <LessonsPage allowedCourseIds={instructorCourseIds} />,
    'lesson-progress': <LessonProgressPage />,
    users: <UsersPage />,
    categories: <CategoriesPage />,
    home: (
      <HomeView
        user={appUser}
        courses={appCourses}
        categories={appCategories}
        certificates={visibleCertificates}
        modules={appModules}
        lessons={appLessons}
        enrollments={appEnrollments}
        onOpenCourse={openCourse}
        onOpenPlayer={openPlayer}
        onNavigate={setView}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    ),
    explore: (
      <ExploreView
        courses={visibleExploreCourses}
        categories={appCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenCourse={openCourse}
        user={appUser}
      />
    ),
    course: (
      <CourseDetailView
        course={selectedCourse}
        modules={appModules}
        lessons={appLessons}
        reviews={appReviews}
        onBack={() => setView('explore')}
        onStart={() => openPlayer(selectedCourse)}
        onEnroll={handleEnrollCourse}
        onNavigate={setView}
        user={appUser}
        completedMessage={completedMessage}
      />
    ),
    player: (
      <PlayerView
        course={selectedCourse}
        lesson={activeLesson}
        lessons={appLessons}
        onSelectLesson={setActiveLesson}
        onComplete={markCompleted}
        completedMessage={completedMessage}
        user={appUser}
      />
    ),
    library: <LibraryView courses={appCourses.filter((course) => course.enrollmentId)} onOpenPlayer={openPlayer} onNavigate={setView} />,
    progress: <UserProgressView user={appUser} courses={appCourses} certificates={visibleCertificates} onOpenPlayer={openPlayer} />,
    certificates: isAdminView
      ? <CertificatesPage />
      : <CertificatesView certificates={visibleCertificates} onNavigate={setView} />,
    profile: <ProfileView user={appUser} users={appUsers} courses={appCourses} modules={appModules} lessons={appLessons} enrollments={appEnrollments} certificates={visibleCertificates} />,
    admin: (
      <BackendPanelView
        resources={BACKEND_RESOURCES}
        activeResourceKey={activeResourceKey}
        setActiveResourceKey={setActiveResourceKey}
        onNavigate={setView}
      />
    ),
  }

  const screen = !canAccessView(view)
    ? <RoleAccessView role={appUser.plan} view={view} onNavigate={setView} />
    : screenByView[view] ?? screenByView.home

  return (
    <AppShell
      user={appUser}
      personas={personaOptions}
      activeView={view}
      onNavigate={setView}
      onLogout={handleLogout}
      onPersonaSwitch={switchPersona}
    >
      {dataNotice ? <div className="data-notice">{dataNotice}</div> : null}
      {screen}
    </AppShell>
  )
}

function AuthView({ mode, onModeChange, onSubmit }) {
  const isCreate = mode === 'create'

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand">
          <span className="brand-mark">UES</span>
          <div>
            <strong>AprendeUes</strong>
            <span>Hacia la libertad por la cultura</span>
          </div>
        </div>
        <div className="auth-copy">
          <span className="eyebrow">Plataforma educativa</span>
          <h1>{isCreate ? 'Comienza tu ruta academica' : 'Continua aprendiendo'}</h1>
          <p>
            Accede a tus cursos, progreso, certificados y contenido de aprendizaje desde una experiencia diseñada para
            estudiantes de la Universidad de El Salvador.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <span className="eyebrow">{isCreate ? 'Crear cuenta' : 'Iniciar sesion'}</span>
            <h2>{isCreate ? 'Registrate en AprendeUes' : 'Bienvenido de nuevo'}</h2>
            <p>
              {isCreate
                ? 'Usa tus datos academicos para preparar tu perfil.'
                : 'Ingresa con tu correo institucional o cuenta registrada.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {isCreate ? (
              <div className="auth-field-row">
                <label>
                  Nombre
                  <input name="firstName" placeholder="Mateo" type="text" required />
                </label>
                <label>
                  Apellido
                  <input name="lastName" placeholder="Rivas" type="text" required />
                </label>
              </div>
            ) : null}

            <label>
              Correo
              <input name="email" placeholder="usuario@ues.edu.sv" type="email" required />
            </label>

            <label>
              Contrasena
              <input name="password" placeholder="Minimo 8 caracteres" type="password" required />
            </label>

            {isCreate ? (
              <label>
                Rol
                <select name="role" defaultValue="student">
                  <option value="student">Estudiante</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
            ) : (
              <div className="auth-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Recordarme
                </label>
                <button type="button">Olvide mi contrasena</button>
              </div>
            )}

            <Button className="auth-submit">
              <Icon name={isCreate ? 'person_add' : 'login'} />
              {isCreate ? 'Crear cuenta' : 'Entrar'}
            </Button>
          </form>

          <div className="auth-switch">
            <span>{isCreate ? 'Ya tienes cuenta?' : 'Aun no tienes cuenta?'}</span>
            <button type="button" onClick={() => onModeChange(isCreate ? 'login' : 'create')}>
              {isCreate ? 'Iniciar sesion' : 'Crear cuenta'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

function RoleAccessView({ role, view, onNavigate }) {
  const isInstructor = role === 'instructor'
  const isStaffView = STAFF_ONLY_VIEWS.has(view)
  const title = isStaffView ? 'Este módulo es para personal académico' : 'Este módulo es solo para Admin'
  const description = isStaffView
    ? `Estás viendo como ${roleLabel(role)}. Cambia a una persona con rol docente o administrador para gestionar este contenido.`
    : `Estás viendo como ${roleLabel(role)}. Cambia a una persona Admin desde el menú de usuario o vuelve a tu espacio disponible.`
  const secondaryAction = isInstructor
    ? ['person', 'Ver mi perfil', 'profile']
    : ['track_changes', 'Ver mi progreso', 'progress']

  return (
    <main className="page role-access-page">
      <section className="admin-panel role-access-card">
        <Icon name="admin_panel_settings" />
        <span className="eyebrow">Vista restringida</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="enrollment-form-actions">
          <Button onClick={() => onNavigate('home')}>
            <Icon name="home" />
            Ir a inicio
          </Button>
          <Button variant="secondary" onClick={() => onNavigate(secondaryAction[2])}>
            <Icon name={secondaryAction[0]} />
            {secondaryAction[1]}
          </Button>
        </div>
      </section>
    </main>
  )
}

function HomeView({
  user,
  courses,
  categories,
  certificates,
  modules,
  lessons,
  enrollments,
  onOpenCourse,
  onOpenPlayer,
  onNavigate,
  activeCategory,
  setActiveCategory,
}) {
  if (user.plan === 'admin') {
    const completedEnrollments = enrollments.filter((enrollment) => Number(enrollment.progress ?? 0) >= 100)

    return (
      <RoleHomeView
        user={user}
        title="Panel de operación"
        description="Supervisa el contenido, las inscripciones y la actividad académica de la plataforma."
        stats={[
          ['school', courses.length, 'Cursos'],
          ['how_to_reg', enrollments.length, 'Inscripciones'],
          ['task_alt', completedEnrollments.length, 'Completadas'],
          ['workspace_premium', certificates.length, 'Certificados'],
        ]}
        actions={[
          ['Módulos', 'Organiza la estructura de cada curso.', 'view_module', 'modules'],
          ['Lecciones', 'Revisa contenido, duración y publicación.', 'play_lesson', 'lessons'],
          ['Inscripciones', 'Acompaña el estado de cada estudiante.', 'how_to_reg', 'enrollments'],
          ['Comentarios', 'Media conversaciones de la comunidad.', 'forum', 'comments'],
        ]}
        courses={courses}
        onOpenCourse={onOpenCourse}
        onNavigate={onNavigate}
      />
    )
  }

  if (user.plan === 'instructor') {
    const { assignedCourses, assignedModules, assignedLessons, assignedEnrollments } = getInstructorScope(user, courses, modules, lessons, enrollments)

    return (
      <RoleHomeView
        user={user}
        title="Panel docente"
        description="Revisa tus cursos, módulos y lecciones publicadas para mantener el aprendizaje al día."
        stats={[
          ['school', assignedCourses.length, 'Cursos asignados'],
          ['view_module', assignedModules.length, 'Módulos'],
          ['play_lesson', assignedLessons.length, 'Lecciones'],
          ['groups', assignedEnrollments.length, 'Estudiantes inscritos'],
        ]}
        actions={[
          ['Mis módulos', 'Crea y organiza los módulos de tus cursos.', 'view_module', 'modules'],
          ['Mis lecciones', 'Añade o actualiza el contenido de cada clase.', 'play_lesson', 'lessons'],
          ['Ver cursos', 'Abre el catálogo docente y revisa contenido.', 'school', 'explore'],
          ['Ajustes', 'Actualiza la información visible del perfil.', 'settings', 'profile'],
        ]}
        courses={assignedCourses}
        onOpenCourse={onOpenCourse}
        onNavigate={onNavigate}
      />
    )
  }

  const learnerStats = getLearnerStats(courses, certificates)
  const currentCourse = learnerStats.nextCourse ?? learnerStats.enrolledCourses[0] ?? null
  const currentCourseAction = currentCourse && courseProgress(currentCourse) >= 100 ? 'Revisar' : 'Continuar'

  return (
    <main className="page home-page">
      <section className="welcome-section">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Bienvenido de nuevo, {user.name.split(' ')[0]}</h1>
          <p>{user.faculty}</p>
        </div>
        <div className="streak-card">
          <Icon name="local_fire_department" filled />
          <span>{user.streak} dias de racha</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="content-stack">
          {currentCourse ? (
            <CourseCard course={currentCourse} onOpen={() => onOpenPlayer(currentCourse)} actionLabel={currentCourseAction} />
          ) : (
            <section className="section-block dashboard-empty-state">
              <Icon name="school" />
              <h2>Aún no tienes cursos inscritos</h2>
              <p>Explora el catálogo e inscríbete a un curso para comenzar tu ruta de aprendizaje.</p>
              <Button onClick={() => onNavigate('explore')}>
                <Icon name="explore" />
                Explorar cursos
              </Button>
            </section>
          )}

          <section className="section-block categories-section">
            <div className="section-heading">
              <h2>Explorar categorias</h2>
            </div>
            <CategoryPills categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
          </section>

          <section className="section-block popular-section">
            <div className="section-heading">
              <h2>Cursos populares</h2>
              <button className="link-button" type="button" onClick={() => setActiveCategory('Todos')}>
                Ver todos
              </button>
            </div>
            <div className="card-grid">
              {courses.slice(1, 5).map((course) => (
                <CourseCard compact course={course} key={course.id} onOpen={onOpenCourse} />
              ))}
            </div>
          </section>
        </div>

        <DashboardSidePanel courses={courses} certificates={certificates} />
      </section>
    </main>
  )
}

function RoleHomeView({ user, title, description, stats, actions, courses, onOpenCourse, onNavigate }) {
  const isAdmin = user.plan === 'admin'
  const emptyTitle = isAdmin ? 'Aún no hay cursos creados' : 'Aún no tienes cursos asignados'
  const emptyText = isAdmin
    ? 'Crea el primer curso desde el panel de gestión para comenzar a poblar la plataforma.'
    : 'Cuando un curso sea asignado a tu usuario docente, aparecerá aquí para revisión.'

  return (
    <main className="page role-home-page">
      <section className="page-header">
        <span className="eyebrow">Inicio · {roleLabel(user.plan)}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <section className="role-home-summary">
        {stats.map(([icon, value, label]) => (
          <article key={label}>
            <Icon name={icon} />
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="role-action-grid">
        {actions.map(([title, text, icon, target]) => (
          <button type="button" key={title} onClick={() => onNavigate(target)}>
            <Icon name={icon} />
            <strong>{title}</strong>
            <span>{text}</span>
          </button>
        ))}
      </section>

      <section className="section-block role-course-panel">
        <div className="section-heading">
          <h2>{isAdmin ? 'Cursos en plataforma' : 'Mis cursos asignados'}</h2>
          <button className="link-button" type="button" onClick={() => onNavigate('explore')}>
            Ver cursos
          </button>
        </div>
        <div className="role-course-list">
          {courses.length > 0 ? (
            courses.slice(0, 6).map((course) => (
              <article key={course.id}>
                <div>
                  <span>{course.category}</span>
                  <h3>{course.title}</h3>
                  <p>{course.instructor}</p>
                </div>
                <button type="button" onClick={() => onOpenCourse(course)}>
                  <Icon name="visibility" />
                  Revisar
                </button>
              </article>
            ))
          ) : (
            <article className="role-course-empty">
              <Icon name={isAdmin ? 'school' : 'assignment_ind'} />
              <div>
                <h3>{emptyTitle}</h3>
                <p>{emptyText}</p>
              </div>
            </article>
          )}
        </div>
      </section>
    </main>
  )
}

function ExploreView({ courses, categories, activeCategory, setActiveCategory, onOpenCourse, user }) {
  const isStaff = user?.plan === 'admin' || user?.plan === 'instructor'
  const isInstructor = user?.plan === 'instructor'

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">{isStaff ? `Cursos · ${roleLabel(user.plan)}` : 'Catalogo'}</span>
        <h1>{isInstructor ? 'Mis cursos asignados' : isStaff ? 'Vista de cursos' : 'Explora cursos de AprendeUes'}</h1>
        <p>
          {isInstructor
            ? 'Revisa únicamente los cursos asignados a tu usuario docente.'
            : isStaff
            ? 'Revisa cursos desde una mirada de gestión: contenido, instructor, módulos y estado general.'
            : 'Filtra por facultad o area y abre el detalle para revisar contenido, instructor y recursos.'}
        </p>
      </section>

      {!isStaff ? (
        <section className="section-block">
          <CategoryPills categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </section>
      ) : null}

      <section className="catalog-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard compact course={course} key={course.id} onOpen={onOpenCourse} actionLabel={isStaff ? 'Revisar curso' : undefined} />
          ))
        ) : (
          <div className="comment-empty-state">
            {isInstructor ? 'Aún no tienes cursos asignados.' : 'No hay cursos disponibles con estos filtros.'}
          </div>
        )}
      </section>
    </main>
  )
}

function CourseDetailView({ course, modules, lessons, reviews, onBack, onStart, onEnroll, onNavigate, user, completedMessage }) {
  if (!course) return null
  const isStaff = user?.plan === 'admin' || user?.plan === 'instructor'
  const courseModules = modules.filter((module) => !module.courseId || module.courseId === course.id)

  return (
    <main className="page">
      <button className="back-button" type="button" onClick={onBack}>
        <Icon name="arrow_back" />
        Volver al catalogo
      </button>

      <section className="course-hero">
        <img src={course.image} alt="" />
        <div className="course-hero-content">
          <span className="eyebrow">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="meta-row">
            <span>
              <Icon name="star" filled /> {course.rating}
            </span>
            <span>
              <Icon name="group" /> {course.students.toLocaleString()} estudiantes
            </span>
            <span>
              <Icon name="schedule" /> {course.duration}
            </span>
            <span>{course.level}</span>
          </div>
        </div>
      </section>

      <section className="course-detail-grid">
        <div className="content-stack">
          {completedMessage ? <div className="data-notice">{completedMessage}</div> : null}

          <InfoPanel title="Lo que aprenderas">
            <div className="learn-grid">
              {[
                'Identificar oportunidades de mejora en proyectos academicos.',
                'Aplicar frameworks modernos con criterio practico.',
                'Analizar casos reales y documentar decisiones tecnicas.',
                'Preparar entregables listos para revision docente.',
              ].map((item) => (
                <p key={item}>
                  <Icon name="check_circle" />
                  {item}
                </p>
              ))}
            </div>
          </InfoPanel>

          <InfoPanel title="Contenido del curso">
            <div className="module-list">
              {(courseModules.length > 0 ? courseModules : modules).map((module, index) => {
                const moduleLessons = module.lessons ?? lessons.filter((lesson) => lesson.moduleId === module.id)
                const moduleTitle = module.title
                const moduleMeta = module.meta ?? `${moduleLessons.length} lecciones`

                return (
                <details open={index === 0} key={module.id ?? module.title}>
                  <summary>
                    <strong>{moduleTitle}</strong>
                    <span>{moduleMeta}</span>
                  </summary>
                  {moduleLessons.length > 0 ? moduleLessons.map((lesson) => (
                    <p key={lesson.id ?? lesson}>
                      <Icon name="play_circle" />
                      {lesson.rawTitle ?? lesson.title ?? lesson}
                    </p>
                  )) : (
                    <p>
                      <Icon name="info" />
                      Las lecciones se cargaran desde /api/lessons.
                    </p>
                  )}
                </details>
                )
              })}
            </div>
          </InfoPanel>

          <InfoPanel title="Tu instructor">
            <div className="instructor-card">
              <div className="avatar large">AM</div>
              <div>
                <h3>{course.instructor}</h3>
                <p>Especialista de AprendeUes con enfoque en aprendizaje aplicado, proyectos guiados y evaluacion progresiva.</p>
              </div>
            </div>
          </InfoPanel>

          <InfoPanel title="Resenas de estudiantes">
            <div className="review-list">
              {reviews.map((review) => (
                <article key={review.name}>
                  <strong>{review.name}</strong>
                  <span>{'★'.repeat(review.rating)}</span>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </InfoPanel>
        </div>

        <aside className="enroll-card">
          {user?.plan === 'admin' ? (
            <>
              <strong>Gestión</strong>
              <p className="enroll-card-note">Vista de revisión para {roleLabel(user.plan)}. Aquí no se inscribe al curso.</p>
              <Button onClick={() => onNavigate('modules')}>
                <Icon name="view_module" />
                Gestionar módulos
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('lessons')}>
                <Icon name="play_lesson" />
                Gestionar lecciones
              </Button>
            </>
          ) : user?.plan === 'instructor' ? (
            <>
              <strong>Docencia</strong>
              <p className="enroll-card-note">Vista docente para revisar el contenido publicado sin inscribirte como estudiante.</p>
              <Button onClick={onBack}>
                <Icon name="school" />
                Ver cursos
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('profile')}>
                <Icon name="person" />
                Ver perfil
              </Button>
            </>
          ) : (
            <>
              <strong>{COURSE_PRICE_LABEL}</strong>
              <p className="enroll-card-note">
                {course.enrollmentId ? 'Ya estás inscrito en este curso.' : 'Inscripción inmediata con tu usuario activo.'}
              </p>
              <Button onClick={() => (course.progress > 0 || course.enrollmentId ? onStart() : onEnroll(course))}>
                <Icon name={course.progress > 0 || course.enrollmentId ? 'play_circle' : 'how_to_reg'} />
                {course.progress > 0 || course.enrollmentId ? 'Continuar curso' : 'Inscribirme gratis'}
              </Button>
            </>
          )}
          <ul>
            <li>Video bajo demanda</li>
            <li>Recursos descargables</li>
            <li>Acceso desde movil y escritorio</li>
            <li>Certificado al finalizar</li>
          </ul>
        </aside>
      </section>
    </main>
  )
}

function PlayerView({ course, lesson, lessons, onSelectLesson, onComplete, completedMessage, user }) {
  const [activeTab, setActiveTab] = useState('description')
  const [comments, setComments] = useState([])
  const [commentUsers, setCommentUsers] = useState([])
  const [commentText, setCommentText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [commentError, setCommentError] = useState('')

  const commentUsersById = useMemo(() => new Map(commentUsers.map((u) => [u.id, u])), [commentUsers])
  const topComments = useMemo(() => comments.filter((c) => !c.parentId), [comments])
  const repliesByParent = useMemo(() => {
    const map = new Map()
    comments.filter((c) => c.parentId).forEach((c) => {
      if (!map.has(c.parentId)) map.set(c.parentId, [])
      map.get(c.parentId).push(c)
    })
    return map
  }, [comments])

  useEffect(() => {
    if (!lesson?.id) return
    setCommentError('')
    Promise.all([api.getComments(), api.getUsers()])
      .then(([commentsDto, usersDto]) => {
        setComments(commentsDto.filter((c) => c.lessonId === lesson.id))
        setCommentUsers(usersDto)
      })
      .catch(() => {})
  }, [lesson?.id])

  const refreshComments = async () => {
    const updated = await api.getComments()
    setComments(updated.filter((c) => c.lessonId === lesson.id))
  }

  const submitComment = async (event) => {
    event.preventDefault()
    if (!commentText.trim() || !user?.id) return
    try {
      await api.createComment({ userId: user.id, lessonId: lesson.id, content: commentText.trim(), parentId: null })
      setCommentText('')
      await refreshComments()
    } catch {
      setCommentError('No se pudo publicar el comentario.')
    }
  }

  const saveEdit = async (comment) => {
    try {
      await api.updateComment(comment.id, {
        userId: comment.userId,
        lessonId: comment.lessonId,
        content: editText.trim(),
        parentId: comment.parentId ?? null,
      })
      setEditingId(null)
      await refreshComments()
    } catch {
      setCommentError('No se pudo actualizar el comentario.')
    }
  }

  const removeComment = async (id) => {
    try {
      await api.deleteComment(id)
      setComments((prev) => prev.filter((c) => c.id !== id && c.parentId !== id))
    } catch {
      setCommentError('No se pudo eliminar el comentario.')
    }
  }

  const getAuthorName = (userId) => {
    const u = commentUsersById.get(userId)
    return u ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email : 'Usuario'
  }

  if (!course || !lesson) return null

  return (
    <main className="page player-page">
      {completedMessage ? <div className="toast">{completedMessage}</div> : null}

      <section className="learning-workspace full">
        <div className="content-stack">
          <VideoPlayerCard title={lesson.title} courseTitle={course.title} videoUrl={lesson.videoUrl} onComplete={onComplete} />

          <section className="tabs-panel">
            <div className="tabs">
              <button className={activeTab === 'description' ? 'active' : ''} type="button" onClick={() => setActiveTab('description')}>
                Descripcion
              </button>
              <button className={activeTab === 'resources' ? 'active' : ''} type="button" onClick={() => setActiveTab('resources')}>
                Recursos ({PLAYER_RESOURCES.length})
              </button>
              <button className={activeTab === 'discussion' ? 'active' : ''} type="button" onClick={() => setActiveTab('discussion')}>
                Discusion ({comments.length})
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'description' ? (
                <p>
                  {lesson.description ||
                    'En esta leccion se profundiza en el patron API Gateway, rutas, autenticacion, rate limiting y orquestacion basica entre servicios.'}
                </p>
              ) : activeTab === 'resources' ? (
                <div className="resource-grid">
                  {PLAYER_RESOURCES.map((resource) => (
                    <a href="#" key={resource}>
                      <Icon name={resource.includes('pdf') ? 'picture_as_pdf' : 'link'} />
                      {resource}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="discussion-panel">
                  {commentError ? <div className="data-notice">{commentError}</div> : null}

                  {user?.id ? (
                    <form className="comment-compose" onSubmit={submitComment}>
                      <div className="avatar comment-avatar">{user.initials}</div>
                      <div className="comment-compose-field">
                        <textarea
                          placeholder="Escribe una duda o aporte sobre esta lección..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={2}
                          required
                        />
                        <Button type="submit">
                          <Icon name="send" />
                          Publicar
                        </Button>
                      </div>
                    </form>
                  ) : null}

                  {topComments.length === 0 ? (
                    <div className="comment-empty-state">Sé el primero en comentar esta lección.</div>
                  ) : (
                    topComments.map((comment) => {
                      const authorName = getAuthorName(comment.userId)
                      const isOwn = comment.userId === user?.id
                      const replies = repliesByParent.get(comment.id) ?? []

                      return (
                        <article className="player-comment" key={comment.id}>
                          <div className="player-comment-main">
                            <div className="avatar comment-avatar">{authorName.slice(0, 2).toUpperCase()}</div>
                            <div className="player-comment-body">
                              <strong>{authorName}</strong>
                              {editingId === comment.id ? (
                                <div className="comment-edit-form">
                                  <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} />
                                  <div className="row-actions">
                                    <Button type="button" onClick={() => saveEdit(comment)}>
                                      <Icon name="save" />
                                      Guardar
                                    </Button>
                                    <Button variant="secondary" type="button" onClick={() => setEditingId(null)}>
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p>{comment.content}</p>
                              )}
                              <div className="comment-card-footer">
                                <span>
                                  <Icon name="thumb_up" />
                                  {comment.likes ?? 0}
                                </span>
                                {isOwn && editingId !== comment.id ? (
                                  <div className="row-actions">
                                    <button
                                      type="button"
                                      aria-label="Editar comentario"
                                      onClick={() => { setEditingId(comment.id); setEditText(comment.content) }}
                                    >
                                      <Icon name="edit" />
                                    </button>
                                    <button
                                      className="danger"
                                      type="button"
                                      aria-label="Eliminar comentario"
                                      onClick={() => removeComment(comment.id)}
                                    >
                                      <Icon name="delete" />
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {replies.map((reply) => {
                            const replyName = getAuthorName(reply.userId)
                            const isOwnReply = reply.userId === user?.id
                            return (
                              <div className="player-comment is-reply" key={reply.id}>
                                <div className="avatar comment-avatar mini">{replyName.slice(0, 2).toUpperCase()}</div>
                                <div className="player-comment-body">
                                  <strong>{replyName}</strong>
                                  <p>{reply.content}</p>
                                  {isOwnReply ? (
                                    <div className="row-actions">
                                      <button
                                        className="danger"
                                        type="button"
                                        aria-label="Eliminar respuesta"
                                        onClick={() => removeComment(reply.id)}
                                      >
                                        <Icon name="delete" />
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )
                          })}
                        </article>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <LessonList lessons={lessons} onSelect={onSelectLesson} />
      </section>
    </main>
  )
}

function LibraryView({ courses, onOpenPlayer, onNavigate }) {
  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Mi aprendizaje</span>
        <h1>Biblioteca de aprendizaje</h1>
        <p>Continua tus cursos activos y revisa tu avance por modulo.</p>
      </section>

      <section className="library-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <article className="library-item" key={course.id}>
              <img src={course.image} alt="" />
              <div>
                <h2>{course.title}</h2>
                <p>{course.instructor}</p>
                <ProgressBar value={course.progress} label="Progreso del curso" />
              </div>
              <Button onClick={() => onOpenPlayer(course)}>Continuar</Button>
            </article>
          ))
        ) : (
          <div className="comment-empty-state">
            Aún no tienes cursos inscritos. Explora cursos para comenzar tu ruta.
            <Button onClick={() => onNavigate('explore')}>
              <Icon name="explore" />
              Explorar cursos
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}

function UserProgressView({ user, courses, certificates, onOpenPlayer }) {
  const { enrolledCourses, completedCourses, nextCourse } = getLearnerStats(courses, certificates)
  const averageProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((total, course) => total + courseProgress(course), 0) / enrolledCourses.length)
    : 0

  return (
    <main className="page user-progress-page">
      <section className="page-header">
        <span className="eyebrow">Mi avance</span>
        <h1>Progreso de aprendizaje</h1>
        <p>{user.name}, aquí puedes revisar cómo vas en tus cursos inscritos y qué puedes continuar ahora.</p>
      </section>

      <section className="user-progress-summary">
        <article>
          <Icon name="school" />
          <strong>{enrolledCourses.length}</strong>
          <span>Cursos inscritos</span>
        </article>
        <article>
          <Icon name="track_changes" />
          <strong>{averageProgress}%</strong>
          <span>Avance promedio</span>
        </article>
        <article>
          <Icon name="workspace_premium" />
          <strong>{certificates.length}</strong>
          <span>Certificados</span>
        </article>
        <article>
          <Icon name="task_alt" />
          <strong>{completedCourses.length}</strong>
          <span>Cursos completados</span>
        </article>
      </section>

      {nextCourse ? (
        <section className="admin-panel progress-continue-panel">
          <div>
            <span className="eyebrow">Siguiente paso</span>
            <h2>Continúa {nextCourse.title}</h2>
            <p>Vas al {Math.round(nextCourse.progress)}%. Retoma el curso para acercarte al certificado.</p>
          </div>
          <Button onClick={() => onOpenPlayer(nextCourse)}>
            <Icon name="play_arrow" />
            Continuar
          </Button>
        </section>
      ) : null}

      <section className="user-progress-list">
        {enrolledCourses.length === 0 ? (
          <div className="comment-empty-state">Aún no tienes cursos inscritos. Explora cursos para comenzar tu ruta.</div>
        ) : (
          enrolledCourses.map((course) => (
            <article className="user-progress-card" key={course.id}>
              <img src={course.image} alt="" />
              <div>
                <span>{course.category}</span>
                <h2>{course.title}</h2>
                <p>{course.instructor}</p>
                <ProgressBar value={course.progress} label="Progreso del curso" />
              </div>
              <div className="user-progress-actions">
                <strong>{Math.round(course.progress)}%</strong>
                <Button variant={course.progress >= 100 ? 'secondary' : 'primary'} onClick={() => onOpenPlayer(course)}>
                  <Icon name={course.progress >= 100 ? 'visibility' : 'play_arrow'} />
                  {course.progress >= 100 ? 'Revisar' : 'Continuar'}
                </Button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  )
}

function CertificatesView({ certificates, onNavigate }) {
  const hasCertificates = certificates.length > 0

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Diplomas</span>
        <h1>Mis diplomas</h1>
        <p>Consulta y descarga los certificados obtenidos al finalizar tus cursos.</p>
      </section>

      <section className="certificate-grid">
        {hasCertificates ? (
          certificates.map((certificate) => (
            <article className="certificate-card" key={certificate.id}>
              <Icon name="verified_user" />
              <h2>{certificate.title}</h2>
              {certificate.studentName ? <p>Otorgado a {certificate.studentName}</p> : null}
              <p>Expedido el {certificate.issuedAt}</p>
              <span>Código: {certificate.code ?? certificate.id}</span>
              <a className="btn btn-secondary certificate-download" href={certificate.downloadUrl} download>
                <Icon name="download" />
                Descargar
              </a>
            </article>
          ))
        ) : (
          <article className="certificate-empty-state">
            <Icon name="workspace_premium" />
            <span className="eyebrow">Aún sin diplomas</span>
            <h2>Aún no has completado ningún curso</h2>
            <p>Cuando finalices un curso y se emita tu certificado, aparecerá aquí listo para descargar.</p>
            <Button onClick={() => onNavigate('explore')}>
              <Icon name="explore" />
              Explorar cursos
            </Button>
          </article>
        )}
      </section>
    </main>
  )
}

function ProfileView({ user, users, courses, modules, lessons, enrollments, certificates }) {
  const isAdmin = user.plan === 'admin'
  const isInstructor = user.plan === 'instructor'
  const learnerStats = getLearnerStats(courses, certificates)
  const instructorStats = isInstructor ? getInstructorScope(user, courses, modules, lessons, enrollments) : null
  const profileLabel = isAdmin ? 'Administrador de plataforma' : isInstructor ? 'Docente activo' : 'Estudiante activo'
  const profileStats = isAdmin
    ? [
        ['group', users.length, 'Usuarios'],
        ['school', courses.length, 'Cursos'],
        ['how_to_reg', enrollments.length, 'Inscripciones'],
        ['workspace_premium', certificates.length, 'Certificados'],
      ]
    : isInstructor
    ? [
        ['school', instructorStats.assignedCourses.length, 'Cursos asignados'],
        ['view_module', instructorStats.assignedModules.length, 'Módulos'],
        ['play_lesson', instructorStats.assignedLessons.length, 'Lecciones'],
        ['groups', instructorStats.assignedEnrollments.length, 'Estudiantes inscritos'],
      ]
    : [
        ['pending_actions', learnerStats.inProgressCourses.length, 'Cursos en progreso'],
        ['task_alt', learnerStats.completedCourses.length, 'Completados'],
        ['workspace_premium', learnerStats.certificatesCount, 'Certificados'],
      ]

  return (
    <main className="page">
      <section className="profile-hero">
        <div className="avatar profile-avatar">{user.initials}</div>
        <div>
          <span className="eyebrow">{profileLabel}</span>
          <h1>{user.name}</h1>
          <p>{user.faculty}</p>
          <p>{user.email}</p>
        </div>
        <Button variant="secondary">
          <Icon name="edit" />
          Editar perfil
        </Button>
      </section>

      <section className="profile-grid">
        {profileStats.map(([icon, value, label]) => (
          <StatCard icon={icon} value={String(value).padStart(2, '0')} label={label} key={label} />
        ))}
      </section>

      <section className="settings-grid">
        {['Informacion personal', 'Seguridad y acceso', 'Preferencias de cuenta', 'Idioma y region'].map((item) => (
          <button type="button" key={item}>
            <span>{item}</span>
            <Icon name="chevron_right" />
          </button>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Actividad reciente</h2>
        </div>
        <div className="activity-list">
          {courses.slice(0, 3).map((course) => (
            <p key={course.id}>
              <Icon name="history" />
              Avance registrado en {course.title}
            </p>
          ))}
        </div>
      </section>
    </main>
  )
}

function BackendPanelView({ resources, activeResourceKey, setActiveResourceKey, onNavigate }) {
  const activeResource = resources.find((resource) => resource.key === activeResourceKey) ?? resources[0]
  const hasDedicatedView = DEDICATED_RESOURCE_VIEWS.has(activeResource.key)

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Mapa del backend</span>
        <h1>Pantallas por recurso REST</h1>
        <p>
          Cada tarjeta corresponde a un controlador del backend conectado por API.
        </p>
      </section>

      <section className="backend-resource-grid">
        {resources.map((resource) => (
          <button
            className={resource.key === activeResource.key ? 'backend-resource-card active' : 'backend-resource-card'}
            type="button"
            key={resource.key}
            onClick={() => {
              setActiveResourceKey(resource.key)
              if (resource.key === 'users' || resource.key === 'categories') {
                onNavigate(resource.key)
              }
            }}
          >
            <Icon name={resource.icon} />
            <strong>{resource.title}</strong>
            <span>{resource.endpoint}</span>
          </button>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">{activeResource.endpoint}</span>
            <h2>{activeResource.title}</h2>
            <p>Gestiona este recurso desde su pagina dedicada en el menu lateral.</p>
          </div>
          {hasDedicatedView ? (
            <Button onClick={() => onNavigate(activeResource.key)}>
              <Icon name="open_in_new" />
              Abrir Gestion Real
            </Button>
          ) : null}
        </div>
      </section>

      <section className="endpoint-map">
        <h2>Cobertura detectada</h2>
        <div>
          {resources.map((resource) => (
            <p key={resource.key}>
              <Icon name="check_circle" />
              <strong>{resource.title}</strong>
              <span>{resource.endpoint}</span>
            </p>
          ))}
        </div>
      </section>
    </main>
  )
}

function DashboardSidePanel({ courses, certificates }) {
  const { inProgressCourses, completedCourses, certificatesCount } = getLearnerStats(courses, certificates)

  return (
    <aside className="side-stack">
      <StatCard icon="pending_actions" value={String(inProgressCourses.length).padStart(2, '0')} label="Cursos en progreso" />
      <StatCard icon="task_alt" value={String(completedCourses.length).padStart(2, '0')} label="Completados" />
      <StatCard icon="workspace_premium" value={String(certificatesCount).padStart(2, '0')} label="Certificados" />

      <section className="mini-panel">
        <h2>Certificados recientes</h2>
        {certificates.length > 0 ? (
          certificates.slice(0, 3).map((certificate) => (
            <a href={certificate.downloadUrl} key={certificate.id} download>
              {certificate.title}
            </a>
          ))
        ) : (
          <p>Aún no tienes certificados emitidos.</p>
        )}
      </section>
    </aside>
  )
}

function InfoPanel({ title, children }) {
  return (
    <section className="info-panel">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export default App
