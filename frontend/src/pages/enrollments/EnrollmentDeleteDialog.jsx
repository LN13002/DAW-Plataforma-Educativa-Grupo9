import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { getEnrollmentCourse, getEnrollmentStudent } from './EnrollmentAdminSections'

export function EnrollmentDeleteDialog({ enrollment, usersById, coursesById, onCancel, onConfirm }) {
  if (!enrollment) return null

  return (
    <div className="modal-overlay">
      <div className="auth-card enrollment-delete-card">
        <div className="auth-card-header">
          <span className="eyebrow">Eliminar inscripción</span>
          <h2>Quitar estudiante del curso</h2>
          <p>
            Se eliminará la inscripción de <strong>{getEnrollmentStudent(enrollment, usersById)}</strong> en{' '}
            <strong>{getEnrollmentCourse(enrollment, coursesById)}</strong>.
          </p>
        </div>
        <div className="enrollment-form-actions">
          <Button onClick={onConfirm}>
            <Icon name="delete" />
            Eliminar
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
