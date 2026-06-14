import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'

export function LessonProgressDeleteDialog({ progress, enrollmentsById, lessonsById, onCancel, onConfirm }) {
  if (!progress) return null

  return (
    <div className="modal-overlay">
      <div className="auth-card progress-delete-card">
        <div className="auth-card-header">
          <span className="eyebrow">Eliminar progreso</span>
          <h2>Quitar registro de avance</h2>
          <p>
            Se eliminará el avance de <strong>{enrollmentsById.get(progress.enrollmentId)?.studentName ?? 'este estudiante'}</strong> en{' '}
            <strong>{lessonsById.get(progress.lessonId)?.title ?? 'esta lección'}</strong>.
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
