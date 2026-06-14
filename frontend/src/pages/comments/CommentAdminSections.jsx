import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'

export function getUserName(user) {
  return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'Usuario sin identificar'
}

export function getLessonContext(comment, lessonsById, modulesById) {
  const lesson = lessonsById.get(comment.lessonId)
  const module = lesson ? modulesById.get(lesson.moduleId) : null
  return {
    lesson,
    module,
    title: lesson?.title ?? 'Lección sin identificar',
    subtitle: module ? `${module.courseTitle ?? 'Curso'} · ${module.title}` : 'Contexto no disponible',
  }
}

export function formatCommentDate(value) {
  return value ? new Date(value).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
}

export function getCommentFormCopy(formMode) {
  return {
    create: {
      eyebrow: 'Comentario de usuario',
      title: 'Crear comentario',
      description: 'El usuario publica una duda o aporte en una lección. Después podrá editarlo o eliminarlo.',
      actorLabel: 'Usuario',
      actorPlaceholder: 'Selecciona usuario',
      contentLabel: 'Comentario',
      contentPlaceholder: 'Escribe la duda, aporte o reflexión del usuario.',
      submitLabel: 'Publicar comentario',
      submitIcon: 'send',
    },
    edit: {
      eyebrow: 'Editar comentario',
      title: 'Actualizar comentario del usuario',
      description: 'Solo se actualiza el contenido del comentario seleccionado. El autor y la lección se conservan.',
      actorLabel: 'Usuario',
      actorPlaceholder: 'Selecciona usuario',
      contentLabel: 'Comentario actualizado',
      contentPlaceholder: 'Ajusta el contenido del comentario.',
      submitLabel: 'Guardar cambios',
      submitIcon: 'save',
    },
    mediate: {
      eyebrow: 'Respuesta de mediación',
      title: 'Responder sin alterar el comentario',
      description: 'La intervención se guarda como un comentario nuevo del administrador. El comentario original permanece intacto.',
      actorLabel: 'Mediador',
      actorPlaceholder: 'Selecciona administrador',
      contentLabel: 'Mensaje del mediador',
      contentPlaceholder: 'Aporta contexto, orienta la conversación o pide mantener el respeto.',
      submitLabel: 'Publicar intervención',
      submitIcon: 'record_voice_over',
    },
  }[formMode]
}

export function CommentSummary({ adminCount, commentCount, stats }) {
  const items = [['forum', commentCount, 'Comentarios'], ['record_voice_over', stats.replies, 'Respuestas'], ['thumb_up', stats.topLiked, 'Máximo likes'], ['admin_panel_settings', adminCount, 'Mediadores']]

  return (
    <section className="comment-summary-grid">
      {items.map(([icon, value, label]) => (
        <article className="comment-summary-card" key={label}>
          <Icon name={icon} />
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        </article>
      ))}
    </section>
  )
}

export function CommentForm({
  adminUsers,
  form,
  formMode,
  lessons,
  lessonsById,
  modulesById,
  onCancel,
  onChange,
  onSubmit,
  regularUsers,
  selectedLessonContext,
  selectedParent,
}) {
  const copy = getCommentFormCopy(formMode)
  const isMediationMode = formMode === 'mediate'
  const isEditMode = formMode === 'edit'

  return (
    <section className="admin-panel comment-mediation-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
      </div>

      <form className="comment-mediation-form" onSubmit={onSubmit}>
        <label className="form-label">
          {copy.actorLabel}
          <select className="form-input" value={form.userId} onChange={onChange('userId')} required disabled={isEditMode}>
            <option value="">{copy.actorPlaceholder}</option>
            {(isMediationMode ? adminUsers : regularUsers).map((user) => (
              <option value={user.id} key={user.id}>
                {getUserName(user)} · {user.email}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Lección
          <select className="form-input" value={form.lessonId} onChange={onChange('lessonId')} required disabled={isEditMode || isMediationMode}>
            <option value="">Selecciona una lección</option>
            {lessons.map((lesson) => {
              const context = getLessonContext({ lessonId: lesson.id }, lessonsById, modulesById)
              return (
                <option value={lesson.id} key={lesson.id}>
                  {context.subtitle} · {lesson.title}
                </option>
              )
            })}
          </select>
        </label>

        {selectedParent ? (
          <div className="comment-original-box">
            <span>Comentario original</span>
            <p>{selectedParent.content}</p>
          </div>
        ) : null}

        <label className="form-label comment-field-wide">{copy.contentLabel}
          <textarea className="form-input comment-textarea" value={form.content} onChange={onChange('content')} placeholder={copy.contentPlaceholder} required />
        </label>

        <div className="comment-context-card">
          <Icon name="school" />
          <div>
            <strong>{selectedLessonContext?.title ?? 'Lección pendiente'}</strong>
            <span>{selectedLessonContext?.subtitle ?? 'Selecciona la lección donde aparecerá la intervención'}</span>
          </div>
        </div>

        <div className="enrollment-form-actions">
          <Button type="submit">
            <Icon name={copy.submitIcon} />
            {copy.submitLabel}
          </Button>
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  )
}

export function CommentList({
  comments,
  commentsById,
  loading,
  modulesById,
  lessonsById,
  onCreate,
  onDelete,
  onEdit,
  onMediate,
  onScopeFilterChange,
  onSearchChange,
  scopeFilter,
  search,
  usersById,
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-header comment-list-header">
        <div>
          <span className="eyebrow">Conversación del curso</span>
          <h2>Conversación por lección</h2>
          <p>Los participantes conservan sus mensajes; la administración puede orientar la conversación con respuestas de mediación.</p>
        </div>
        <div className="comment-header-actions">
          <Button variant="secondary" onClick={() => onMediate()}>
            <Icon name="record_voice_over" />
            Mediar
          </Button>
          <Button onClick={onCreate}>
            <Icon name="add_comment" />
            Nuevo comentario
          </Button>
        </div>
      </div>

      <div className="comment-toolbar">
        <label className="search admin-search">
          <Icon name="search" />
          <input placeholder="Buscar autor, lección o contenido" type="search" value={search} onChange={onSearchChange} />
        </label>
        <div className="enrollment-filter-group" aria-label="Filtrar comentarios">
          {[
            ['all', 'Todos'],
            ['questions', 'Principales'],
            ['replies', 'Respuestas'],
          ].map(([value, label]) => (
            <button className={scopeFilter === value ? 'active' : ''} type="button" key={value} onClick={() => onScopeFilterChange(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <CommentCards
        comments={comments}
        commentsById={commentsById}
        lessonsById={lessonsById}
        loading={loading}
        modulesById={modulesById}
        onDelete={onDelete}
        onEdit={onEdit}
        onMediate={onMediate}
        usersById={usersById}
      />
    </section>
  )
}

function CommentCards({ comments, commentsById, lessonsById, loading, modulesById, onDelete, onEdit, onMediate, usersById }) {
  if (loading) return <div className="comment-empty-state">Cargando comentarios...</div>
  if (comments.length === 0) return <div className="comment-empty-state">No hay comentarios con esos filtros.</div>

  return (
    <div className="comment-list">
      {comments.map((comment) => {
        const author = usersById.get(comment.userId)
        const parent = comment.parentId ? commentsById.get(comment.parentId) : null
        const context = getLessonContext(comment, lessonsById, modulesById)
        const isAdmin = author?.role === 'admin' || author?.role === 'ADMIN'

        return (
          <article className={comment.parentId ? 'comment-card is-reply' : 'comment-card'} key={comment.id}>
            <div className="comment-card-header">
              <div className="avatar comment-avatar">{getUserName(author).slice(0, 2).toUpperCase()}</div>
              <div>
                <strong>{getUserName(author)}</strong>
                <span>{isAdmin ? 'Mediador' : 'Participante'} · {formatCommentDate(comment.createdAt)}</span>
              </div>
              <span className={isAdmin ? 'comment-role-badge admin' : 'comment-role-badge'}>{isAdmin ? 'Administrador' : 'Participante'}</span>
            </div>

            <div className="comment-context">
              <Icon name="play_lesson" />
              <span>{context.subtitle} · {context.title}</span>
            </div>

            {parent ? <blockquote className="comment-parent">En respuesta a: {parent.content}</blockquote> : null}
            <p className="comment-body">{comment.content}</p>

            <div className="comment-card-footer">
              <span>
                <Icon name="thumb_up" />
                {comment.likes ?? 0} likes
              </span>
              <div className="comment-actions">
                <button type="button" onClick={() => onMediate(comment)}>
                  <Icon name="record_voice_over" />
                  Mediar
                </button>
                {!isAdmin ? (
                  <>
                    <button type="button" onClick={() => onEdit(comment)}>
                      <Icon name="edit" />
                      Editar
                    </button>
                    <button className="danger" type="button" onClick={() => onDelete(comment)}>
                      <Icon name="delete" />
                      Eliminar
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
