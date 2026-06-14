import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { StatCard } from '../components/StatCard'
import { getInstructorScope, getLearnerStats } from '../utils/learning'

const SETTINGS_ITEMS = ['Información personal', 'Seguridad y acceso', 'Preferencias de cuenta', 'Idioma y región']

export function ProfileView({ user, users, courses, modules, lessons, enrollments, certificates }) {
  const isAdmin = user.plan === 'admin'
  const isInstructor = user.plan === 'instructor'
  const learnerStats = getLearnerStats(courses, certificates)
  const instructorStats = isInstructor ? getInstructorScope(user, courses, modules, lessons, enrollments) : null
  const profileLabel = isAdmin ? 'Administrador de plataforma' : isInstructor ? 'Docente activo' : 'Estudiante activo'
  const profileStats = getProfileStats({ certificates, courses, enrollments, instructorStats, isAdmin, isInstructor, learnerStats, users })
  const activityItems = getActivityItems({ certificates, courses, instructorStats, isAdmin, isInstructor, learnerStats, users })

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
        {SETTINGS_ITEMS.map((item) => (
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
          {activityItems.length > 0 ? activityItems.map(([icon, text]) => (
            <p key={text}>
              <Icon name={icon} />
              {text}
            </p>
          )) : (
            <p>
              <Icon name="info" />
              Aún no hay actividad reciente para mostrar.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

function getProfileStats({ certificates, courses, enrollments, instructorStats, isAdmin, isInstructor, learnerStats, users }) {
  if (isAdmin) {
    return [
      ['group', users.length, 'Usuarios'],
      ['school', courses.length, 'Cursos'],
      ['how_to_reg', enrollments.length, 'Inscripciones'],
      ['workspace_premium', certificates.length, 'Certificados'],
    ]
  }

  if (isInstructor) {
    return [
      ['school', instructorStats.assignedCourses.length, 'Cursos asignados'],
      ['view_module', instructorStats.assignedModules.length, 'Módulos'],
      ['play_lesson', instructorStats.assignedLessons.length, 'Lecciones'],
      ['groups', instructorStats.assignedEnrollments.length, 'Estudiantes inscritos'],
    ]
  }

  return [
    ['pending_actions', learnerStats.inProgressCourses.length, 'Cursos en progreso'],
    ['task_alt', learnerStats.completedCourses.length, 'Completados'],
    ['workspace_premium', learnerStats.certificatesCount, 'Certificados'],
  ]
}

function getActivityItems({ certificates, courses, instructorStats, isAdmin, isInstructor, learnerStats, users }) {
  if (isAdmin) {
    return [
      ['group', `${users.length} usuarios registrados`],
      ['school', `${courses.length} cursos disponibles en la plataforma`],
      ['workspace_premium', `${certificates.length} certificados emitidos`],
    ]
  }

  if (isInstructor) {
    return [
      ['school', `${instructorStats.assignedCourses.length} cursos asignados`],
      ['view_module', `${instructorStats.assignedModules.length} módulos bajo tu responsabilidad`],
      ['play_lesson', `${instructorStats.assignedLessons.length} lecciones publicadas`],
    ]
  }

  return learnerStats.enrolledCourses.slice(0, 3).map((course) => ['history', `Avance registrado en ${course.title}`])
}
