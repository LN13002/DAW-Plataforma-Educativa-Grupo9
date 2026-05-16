import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = {
  userId: '',
  lessonId: '',
  parentId: '',
  content: '',
}

function getUserName(user) {
  return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'Usuario sin identificar'
}

function getLessonContext(comment, lessonsById, modulesById) {
  const lesson = lessonsById.get(comment.lessonId)
  const module = lesson ? modulesById.get(lesson.moduleId) : null
  return {
    lesson,
    module,
    title: lesson?.title ?? 'Lección sin identificar',
    subtitle: module ? `${module.courseTitle ?? 'Curso'} · ${module.title}` : 'Contexto no disponible',
  }
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
}

export function CommentsPage() {
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [lessons, setLessons] = useState([])
  const [modules, setModules] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selectedComment, setSelectedComment] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [scopeFilter, setScopeFilter] = useState('all')

  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])
  const lessonsById = useMemo(() => new Map(lessons.map((lesson) => [lesson.id, lesson])), [lessons])
  const modulesById = useMemo(() => new Map(modules.map((module) => [module.id, module])), [modules])
  const commentsById = useMemo(() => new Map(comments.map((comment) => [comment.id, comment])), [comments])
  const adminUsers = useMemo(() => users.filter((user) => user.role === 'admin' || user.role === 'ADMIN'), [users])
  const regularUsers = useMemo(() => users.filter((user) => user.role !== 'admin' && user.role !== 'ADMIN'), [users])

  const selectedLessonContext = form.lessonId
    ? getLessonContext({ lessonId: form.lessonId }, lessonsById, modulesById)
    : null
  const selectedParent = form.parentId ? commentsById.get(form.parentId) : null
  const isMediationMode = formMode === 'mediate'
  const isEditMode = formMode === 'edit'

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const loadData = async () => {
    setLoading(true)
    try {
      const [commentsDto, usersDto, lessonsDto, modulesDto] = await Promise.all([
        api.getComments(),
        api.getUsers(),
        api.getLessons(),
        api.getModules(),
      ])
      setComments(commentsDto)
      setUsers(usersDto)
      setLessons(lessonsDto)
      setModules(modulesDto)
      setError('')
    } catch {
      setError('No se pudieron cargar los comentarios desde la API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!form.userId && formMode === 'mediate' && adminUsers.length > 0) {
      setForm((prev) => ({ ...prev, userId: adminUsers[0].id }))
    }
    if (!form.userId && formMode === 'create' && regularUsers.length > 0) {
      setForm((prev) => ({ ...prev, userId: regularUsers[0].id }))
    }
  }, [adminUsers, form.userId, formMode, regularUsers])

  const closeForm = () => {
    setFormMode(null)
    setSelectedComment(null)
    setForm(emptyForm)
  }

  const openUserComment = () => {
    setSelectedComment(null)
    setForm({
      userId: regularUsers[0]?.id ?? '',
      lessonId: '',
      parentId: '',
      content: '',
    })
    setFormMode('create')
  }

  const openEditComment = (comment) => {
    setSelectedComment(comment)
    setForm({
      userId: comment.userId,
      lessonId: comment.lessonId,
      parentId: comment.parentId ?? '',
      content: comment.content,
    })
    setFormMode('edit')
  }

  const openMediation = (comment = null) => {
    const admin = adminUsers[0]
    setSelectedComment(null)
    setForm({
      userId: admin?.id ?? '',
      lessonId: comment?.lessonId ?? '',
      parentId: comment?.id ?? '',
      content: '',
    })
    setFormMode('mediate')
  }

  const submit = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        userId: form.userId,
        lessonId: form.lessonId,
        parentId: form.parentId || null,
        content: form.content,
      }

      if (isEditMode) {
        await api.updateComment(selectedComment.id, payload)
      } else {
        await api.createComment(payload)
      }

      closeForm()
      await loadData()
    } catch {
      setError('No se pudo guardar el comentario. Revisa usuario, lección y contenido.')
    }
  }

  const remove = async () => {
    try {
      await api.deleteComment(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el comentario.')
    }
  }

  const filteredComments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return comments.filter((comment) => {
      const author = getUserName(usersById.get(comment.userId)).toLowerCase()
      const context = getLessonContext(comment, lessonsById, modulesById)
      const isReply = Boolean(comment.parentId)
      const matchesScope =
        scopeFilter === 'all' ||
        (scopeFilter === 'questions' && !isReply) ||
        (scopeFilter === 'replies' && isReply)
      const matchesSearch =
        !query ||
        author.includes(query) ||
        comment.content.toLowerCase().includes(query) ||
        context.title.toLowerCase().includes(query) ||
        context.subtitle.toLowerCase().includes(query)

      return matchesScope && matchesSearch
    })
  }, [comments, lessonsById, modulesById, scopeFilter, search, usersById])

  const stats = useMemo(() => {
    const replies = comments.filter((comment) => comment.parentId).length
    const topLiked = comments.reduce((max, comment) => Math.max(max, Number(comment.likes ?? 0)), 0)
    return { replies, topLiked }
  }, [comments])

  const formCopy = {
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
      actorPlaceholder: 'Selecciona admin',
      contentLabel: 'Mensaje del mediador',
      contentPlaceholder: 'Aporta contexto, orienta la conversación o pide mantener el respeto.',
      submitLabel: 'Publicar intervención',
      submitIcon: 'record_voice_over',
    },
  }[formMode]

  return (
    <main className="page comments-moderation-page">
      <section className="page-header">
        <span className="eyebrow">Comunidad del curso</span>
        <h1>Comentarios</h1>
        <p>Los usuarios gestionan sus comentarios; el admin acompaña la conversación como mediador sin alterar mensajes ajenos.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      <section className="comment-summary-grid">
        <article className="comment-summary-card">
          <Icon name="forum" />
          <div>
            <strong>{comments.length}</strong>
            <span>Comentarios</span>
          </div>
        </article>
        <article className="comment-summary-card">
          <Icon name="record_voice_over" />
          <div>
            <strong>{stats.replies}</strong>
            <span>Respuestas</span>
          </div>
        </article>
        <article className="comment-summary-card">
          <Icon name="thumb_up" />
          <div>
            <strong>{stats.topLiked}</strong>
            <span>Máximo likes</span>
          </div>
        </article>
        <article className="comment-summary-card">
          <Icon name="admin_panel_settings" />
          <div>
            <strong>{adminUsers.length}</strong>
            <span>Mediadores</span>
          </div>
        </article>
      </section>

      {formMode ? (
        <section className="admin-panel comment-mediation-panel">
          <div className="admin-panel-header">
          <div>
            <span className="eyebrow">{formCopy.eyebrow}</span>
            <h2>{formCopy.title}</h2>
            <p>{formCopy.description}</p>
          </div>
        </div>

          <form className="comment-mediation-form" onSubmit={submit}>
            <label className="form-label">
              {formCopy.actorLabel}
              <select className="form-input" value={form.userId} onChange={field('userId')} required disabled={isEditMode}>
                <option value="">{formCopy.actorPlaceholder}</option>
                {(isMediationMode ? adminUsers : regularUsers).map((user) => (
                  <option value={user.id} key={user.id}>
                    {getUserName(user)} · {user.email}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-label">
              Lección
              <select className="form-input" value={form.lessonId} onChange={field('lessonId')} required disabled={isEditMode || isMediationMode}>
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

            <label className="form-label comment-field-wide">
              {formCopy.contentLabel}
              <textarea
                className="form-input comment-textarea"
                value={form.content}
                onChange={field('content')}
                placeholder={formCopy.contentPlaceholder}
                required
              />
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
                <Icon name={formCopy.submitIcon} />
                {formCopy.submitLabel}
              </Button>
              <Button variant="secondary" type="button" onClick={closeForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header comment-list-header">
          <div>
            <span className="eyebrow">Conversación del curso</span>
            <h2>Conversación por lección</h2>
            <p>El usuario normal crea, edita y elimina sus comentarios. El admin solo agrega respuestas de mediación.</p>
          </div>
          <div className="comment-header-actions">
            <Button variant="secondary" onClick={() => openMediation()}>
              <Icon name="record_voice_over" />
              Mediar
            </Button>
            <Button onClick={openUserComment}>
              <Icon name="add_comment" />
              Nuevo comentario
            </Button>
          </div>
        </div>

        <div className="comment-toolbar">
          <label className="search admin-search">
            <Icon name="search" />
            <input
              placeholder="Buscar autor, lección o contenido"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="enrollment-filter-group" aria-label="Filtrar comentarios">
            {[
              ['all', 'Todos'],
              ['questions', 'Principales'],
              ['replies', 'Respuestas'],
            ].map(([value, label]) => (
              <button className={scopeFilter === value ? 'active' : ''} type="button" key={value} onClick={() => setScopeFilter(value)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="comment-list">
          {loading ? (
            <div className="comment-empty-state">Cargando comentarios...</div>
          ) : filteredComments.length === 0 ? (
            <div className="comment-empty-state">No hay comentarios con esos filtros.</div>
          ) : (
            filteredComments.map((comment) => {
              const author = usersById.get(comment.userId)
              const parent = comment.parentId ? commentsById.get(comment.parentId) : null
              const context = getLessonContext(comment, lessonsById, modulesById)
              const isAdmin = author?.role === 'admin' || author?.role === 'ADMIN'
              const canUserManage = !isAdmin

              return (
                <article className={comment.parentId ? 'comment-card is-reply' : 'comment-card'} key={comment.id}>
                  <div className="comment-card-header">
                    <div className="avatar comment-avatar">{getUserName(author).slice(0, 2).toUpperCase()}</div>
                    <div>
                      <strong>{getUserName(author)}</strong>
                      <span>{isAdmin ? 'Mediador' : 'Participante'} · {formatDate(comment.createdAt)}</span>
                    </div>
                    <span className={isAdmin ? 'comment-role-badge admin' : 'comment-role-badge'}>{isAdmin ? 'Admin' : 'Usuario'}</span>
                  </div>

                  <div className="comment-context">
                    <Icon name="play_lesson" />
                    <span>{context.subtitle} · {context.title}</span>
                  </div>

                  {parent ? (
                    <blockquote className="comment-parent">
                      En respuesta a: {parent.content}
                    </blockquote>
                  ) : null}

                  <p className="comment-body">{comment.content}</p>

                  <div className="comment-card-footer">
                    <span>
                      <Icon name="thumb_up" />
                      {comment.likes ?? 0} likes
                    </span>
                    <div className="comment-actions">
                      <button type="button" onClick={() => openMediation(comment)}>
                        <Icon name="record_voice_over" />
                        Mediar
                      </button>
                      {canUserManage ? (
                        <>
                          <button type="button" onClick={() => openEditComment(comment)}>
                            <Icon name="edit" />
                            Editar
                          </button>
                          <button className="danger" type="button" onClick={() => setDeleteTarget(comment)}>
                            <Icon name="delete" />
                            Eliminar
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      {deleteTarget ? (
        <div className="modal-overlay">
          <div className="auth-card comment-delete-card">
            <div className="auth-card-header">
              <span className="eyebrow">Eliminar comentario</span>
              <h2>Acción de usuario</h2>
              <p>
                Se eliminará el comentario de <strong>{getUserName(usersById.get(deleteTarget.userId))}</strong>. Esta acción corresponde
                al CRUD del usuario normal, no a la mediación del admin.
              </p>
            </div>
            <div className="comment-original-box">
              <span>Contenido</span>
              <p>{deleteTarget.content}</p>
            </div>
            <div className="enrollment-form-actions">
              <Button onClick={remove}>
                <Icon name="delete" />
                Eliminar
              </Button>
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}

    </main>
  )
}
