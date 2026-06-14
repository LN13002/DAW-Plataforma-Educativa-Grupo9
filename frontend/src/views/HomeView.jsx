import { useState } from 'react'
import { Button } from '../components/Button'
import { CategoryPills } from '../components/CategoryPills'
import { CourseCard } from '../components/CourseCard'
import { Icon } from '../components/Icon'
import { StatCard } from '../components/StatCard'
import { courseProgress, getInstructorScope, getLearnerStats, roleLabel } from '../utils/learning'

export function HomeView({
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
          ['Comentarios', 'Acompaña conversaciones de la comunidad.', 'forum', 'comments'],
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
          <span>{user.streak} días de racha</span>
        </div>
      </section>

      <DashboardSidePanel courses={courses} certificates={certificates} />

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
              <h2>Explorar categorías</h2>
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

function DashboardSidePanel({ courses, certificates }) {
  const { inProgressCourses, completedCourses, certificatesCount } = getLearnerStats(courses, certificates)
  const [showCertificates, setShowCertificates] = useState(false)

  return (
    <aside className="side-stack">
      <StatCard icon="pending_actions" value={String(inProgressCourses.length).padStart(2, '0')} label="Cursos en progreso" />
      <StatCard icon="task_alt" value={String(completedCourses.length).padStart(2, '0')} label="Completados" />
      <div style={{ display: 'grid', gap: '12px' }}>
        <StatCard
          icon="workspace_premium"
          value={String(certificatesCount).padStart(2, '0')}
          label="Certificados"
          onClick={() => setShowCertificates((prev) => !prev)}
        />
        {showCertificates ? (
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
        ) : null}
      </div>
    </aside>
  )
}
