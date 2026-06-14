import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { getUserName } from './CommentAdminSections'

export function CommentDeleteDialog({ comment, usersById, onCancel, onConfirm }) {
  if (!comment) return null

  return (
    <div className="modal-overlay">
      <div className="auth-card comment-delete-card">
        <div className="auth-card-header">
          <span className="eyebrow">Eliminar comentario</span>
          <h2>Acción de usuario</h2>
          <p>
            Se eliminará el comentario de <strong>{getUserName(usersById.get(comment.userId))}</strong>. Revisa que no sea parte de una conversación académica que convenga conservar.
          </p>
        </div>
        <div className="comment-original-box">
          <span>Contenido</span>
          <p>{comment.content}</p>
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
