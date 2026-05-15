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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [authView, setAuthView] = useState('login')
  const [view, setView] = useState('home')
  const [appUser, setAppUser] = useState(DEFAULT_USER)
  const [appCourses, setAppCourses] = useState([])
  const [appCategories, setAppCategories] = useState(['Todos'])
  const [appLessons, setAppLessons] = useState([])
  const [appCertificates, setAppCertificates] = useState([])
  const [appModules, setAppModules] = useState([])
  const [appEnrollments, setAppEnrollments] = useState([])
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

        const student = usersDto.find((user) => user.role === 'student') ?? usersDto[0]
        if (student) {
          setAppUser({
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            initials: `${student.firstName?.[0] ?? ''}${student.lastName?.[0] ?? ''}`.toUpperCase(),
            faculty: 'Usuario registrado en UES Virtual',
            email: student.email,
            plan: student.role,
            streak: 0,
          })
        }

        const mappedCourses = coursesDto.map((course, index) => mapCourseDto(course, index, enrollmentsDto))
        const mappedCategories = categoriesDto.map(mapCategoryDto)
        const mappedLessons = lessonsDto.map((lesson) => mapLessonDto(lesson))
        const mappedCertificates = certificatesDto.map(mapCertificateDto)

        if (mappedCourses.length > 0) {
          setAppCourses(mappedCourses)
          setSelectedCourse((current) => mappedCourses.find((course) => course.id === current?.id) ?? mappedCourses[0])
        }

        setAppCategories(['Todos', ...mappedCategories])
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
    if (selectedCourse.enrollmentId && activeLesson?.id) {
      try {
        await api.upsertLessonProgress({
          enrollmentId: selectedCourse.enrollmentId,
          lessonId: activeLesson.id,
          secondsWatched: activeLesson.durationSeconds ?? 0,
          completed: true,
        })
        setCompletedMessage('Leccion marcada como completada en el backend.')
      } catch {
        setCompletedMessage('No se pudo actualizar el progreso en la API. Revisa que el backend este activo.')
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
          role: formData.get('role'),
        })
        setAppUser({
          id: createdUser.id,
          name: `${createdUser.firstName} ${createdUser.lastName}`,
          initials: `${createdUser.firstName?.[0] ?? ''}${createdUser.lastName?.[0] ?? ''}`.toUpperCase(),
          faculty: 'Usuario registrado en UES Virtual',
          email: createdUser.email,
          plan: createdUser.role,
          streak: 0,
        })
      } catch {
        setDataNotice('No se pudo crear la cuenta en la API. Entrando en modo demo.')
      }
    } else {
      try {
        const users = await api.getUsers()
        const email = formData.get('email')
        const foundUser = users.find((user) => user.email === email) ?? users[0]
        if (foundUser) {
          setAppUser({
            id: foundUser.id,
            name: `${foundUser.firstName} ${foundUser.lastName}`,
            initials: `${foundUser.firstName?.[0] ?? ''}${foundUser.lastName?.[0] ?? ''}`.toUpperCase(),
            faculty: 'Usuario registrado en UES Virtual',
            email: foundUser.email,
            plan: foundUser.role,
            streak: 0,
          })
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

  const screen = {
    modules: <ModulesPage />,
    comments: <CommentsPage />,
    enrollments: <EnrollmentsPage />,
    lessons: <LessonsPage />,
    'lesson-progress': <LessonProgressPage />,
    home: (
      <HomeView
        user={appUser}
        courses={appCourses}
        categories={appCategories}
        certificates={appCertificates}
        onOpenCourse={openCourse}
        onOpenPlayer={openPlayer}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        
        
      />
    ),
    explore: (
      <ExploreView
        courses={filteredCourses}
        categories={appCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenCourse={openCourse}
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
      />
    ),
    library: <LibraryView courses={appCourses.filter((course) => course.progress > 0)} onOpenPlayer={openPlayer} />,
    certificates: <CertificatesView certificates={appCertificates} />,
    admin: (
      <BackendPanelView
        resources={BACKEND_RESOURCES}
        activeResourceKey={activeResourceKey}
        setActiveResourceKey={setActiveResourceKey}
      />
    ),
    profile: <ProfileView user={appUser} courses={appCourses} certificates={appCertificates} />,
  }[view]

  return (
    <AppShell user={appUser} activeView={view} onNavigate={setView} onLogout={handleLogout}>
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

function HomeView({ user, courses, categories, certificates, onOpenCourse, onOpenPlayer, activeCategory, setActiveCategory }) {
  const currentCourse = courses[0]

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
            <CourseCard course={currentCourse} onOpen={() => onOpenPlayer(currentCourse)} actionLabel="Continuar" />
          ) : (
            <section className="section-block">
              <p>Cargando cursos...</p>
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

        <DashboardSidePanel certificates={certificates} />
      </section>
    </main>
  )
}

function ExploreView({ courses, categories, activeCategory, setActiveCategory, onOpenCourse }) {
  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Catalogo</span>
        <h1>Explora cursos de AprendeUes</h1>
        <p>Filtra por facultad o area y abre el detalle para revisar contenido, instructor y recursos.</p>
      </section>

      <section className="section-block">
        <CategoryPills categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </section>

      <section className="catalog-grid">
        {courses.map((course) => (
          <CourseCard compact course={course} key={course.id} onOpen={onOpenCourse} />
        ))}
      </section>
    </main>
  )
}

function CourseDetailView({ course, modules, lessons, reviews, onBack, onStart, onEnroll }) {
  if (!course) return null
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
          <strong>{COURSE_PRICE_LABEL}</strong>
          <Button onClick={() => (course.progress > 0 || course.enrollmentId ? onStart() : onEnroll(course))}>
            <Icon name={course.progress > 0 ? 'play_circle' : 'school'} />
            {course.progress > 0 ? 'Continuar curso' : 'Inscribirme'}
          </Button>
          <Button variant="secondary">
            <Icon name="shopping_cart" />
            Agregar a biblioteca
          </Button>
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

function PlayerView({ course, lesson, lessons, onSelectLesson, onComplete, completedMessage }) {
  if (!course || !lesson) return null
  return (
    <main className="page player-page">
      {completedMessage ? <div className="toast">{completedMessage}</div> : null}

      <section className="learning-workspace full">
        <div className="content-stack">
          <VideoPlayerCard title={lesson.title} courseTitle={course.title} onComplete={onComplete} />

          <section className="tabs-panel">
            <div className="tabs">
              <button className="active" type="button">
                Descripcion
              </button>
              <button type="button">Recursos ({PLAYER_RESOURCES.length})</button>
              <button type="button">Discusion</button>
            </div>
            <div className="tab-content">
              <p>
                En esta leccion se profundiza en el patron API Gateway, rutas, autenticacion, rate limiting y
                orquestacion basica entre servicios.
              </p>
              <div className="resource-grid">
                {PLAYER_RESOURCES.map((resource) => (
                  <a href="#" key={resource}>
                    <Icon name={resource.includes('pdf') ? 'picture_as_pdf' : 'link'} />
                    {resource}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>

        <LessonList lessons={lessons} onSelect={onSelectLesson} />
      </section>
    </main>
  )
}

function LibraryView({ courses, onOpenPlayer }) {
  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Mi aprendizaje</span>
        <h1>Biblioteca de aprendizaje</h1>
        <p>Continua tus cursos activos y revisa tu avance por modulo.</p>
      </section>

      <section className="library-list">
        {courses.map((course) => (
          <article className="library-item" key={course.id}>
            <img src={course.image} alt="" />
            <div>
              <h2>{course.title}</h2>
              <p>{course.instructor}</p>
              <ProgressBar value={course.progress} label="Progreso del curso" />
            </div>
            <Button onClick={() => onOpenPlayer(course)}>Continuar</Button>
          </article>
        ))}
      </section>
    </main>
  )
}

function CertificatesView({ certificates }) {
  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Diplomas</span>
        <h1>Certificados recientes</h1>
        <p>Documentos listos para descargar cuando el backend habilite archivos reales.</p>
      </section>

      <section className="certificate-grid">
        {certificates.map((certificate) => (
          <article className="certificate-card" key={certificate.id}>
            <Icon name="verified_user" />
            <h2>{certificate.title}</h2>
            <p>Expedido el {certificate.issuedAt}</p>
            <span>ID: {certificate.id}</span>
            <Button variant="secondary">
              <Icon name="download" />
              Descargar
            </Button>
          </article>
        ))}
      </section>
    </main>
  )
}

function ProfileView({ user, courses, certificates }) {
  return (
    <main className="page">
      <section className="profile-hero">
        <div className="avatar profile-avatar">{user.initials}</div>
        <div>
          <span className="eyebrow">Estudiante activo</span>
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
        <StatCard icon="pending_actions" value="04" label="Cursos en progreso" />
        <StatCard icon="task_alt" value="12" label="Completados" />
        <StatCard icon="workspace_premium" value={String(certificates.length).padStart(2, '0')} label="Certificados" />
      </section>

      <section className="settings-grid">
        {['Informacion personal', 'Seguridad y acceso', 'Pagos y facturacion', 'Idioma y region'].map((item) => (
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

function BackendPanelView({ resources, activeResourceKey, setActiveResourceKey }) {
  const activeResource = resources.find((resource) => resource.key === activeResourceKey) ?? resources[0]

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
            onClick={() => setActiveResourceKey(resource.key)}
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

function DashboardSidePanel({ certificates }) {
  return (
    <aside className="side-stack">
      <StatCard icon="pending_actions" value="04" label="Cursos en progreso" />
      <StatCard icon="task_alt" value="12" label="Completados" />
      <StatCard icon="workspace_premium" value="03" label="Certificados" />

      <section className="mini-panel">
        <h2>Certificados recientes</h2>
        {certificates.slice(0, 3).map((certificate) => (
          <a href="#" key={certificate.id}>
            {certificate.title}
          </a>
        ))}
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
