import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { LEARNER_ONLY_VIEWS, STAFF_ONLY_VIEWS } from '../constants/app'
import { roleLabel } from '../utils/learning'

export function RoleAccessView({ role, view, onNavigate }) {
  const isAdmin = role === 'admin'
  const isInstructor = role === 'instructor'
  const isStaffView = STAFF_ONLY_VIEWS.has(view)
  const isLearnerView = LEARNER_ONLY_VIEWS.has(view) || (view === 'certificates' && isInstructor)
  const title = isLearnerView
    ? 'Este módulo es para estudiantes'
    : isStaffView
    ? 'Este módulo es para personal académico'
    : 'Este módulo es solo para Admin'
  const description = isLearnerView
    ? `Estás viendo como ${roleLabel(role)}. Cambia a una persona estudiante para acceder a esta vista de aprendizaje.`
    : isStaffView
    ? `Estás viendo como ${roleLabel(role)}. Cambia a una persona con rol docente o administrador para gestionar este contenido.`
    : `Estás viendo como ${roleLabel(role)}. Cambia a una persona Admin desde el menú de usuario o vuelve a tu espacio disponible.`
  const secondaryAction = isAdmin || isInstructor
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
