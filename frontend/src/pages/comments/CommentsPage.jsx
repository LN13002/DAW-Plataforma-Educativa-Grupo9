import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import {
  CommentForm,
  CommentList,
  CommentSummary,
  getLessonContext,
  getUserName,
} from './CommentAdminSections'
import { CommentDeleteDialog } from './CommentDeleteDialog'

const emptyForm = {
  userId: '',
  lessonId: '',
  parentId: '',
  content: '',
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
  const selectedLessonContext = form.lessonId ? getLessonContext({ lessonId: form.lessonId }, lessonsById, modulesById) : null
  const selectedParent = form.parentId ? commentsById.get(form.parentId) : null

  const filteredComments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return comments.filter((comment) => {
      const author = getUserName(usersById.get(comment.userId)).toLowerCase()
      const context = getLessonContext(comment, lessonsById, modulesById)
      const isReply = Boolean(comment.parentId)
      const matchesScope = scopeFilter === 'all' || (scopeFilter === 'questions' && !isReply) || (scopeFilter === 'replies' && isReply)
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

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  async function loadData() {
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
      setError('No se pudieron cargar los comentarios.')
    } finally {
      setLoading(false)
    }
  }

  function closeForm() {
    setFormMode(null)
    setSelectedComment(null)
    setForm(emptyForm)
  }

  function openUserComment() {
    setSelectedComment(null)
    setForm({ userId: regularUsers[0]?.id ?? '', lessonId: '', parentId: '', content: '' })
    setFormMode('create')
  }

  function openEditComment(comment) {
    setSelectedComment(comment)
    setForm({
      userId: comment.userId,
      lessonId: comment.lessonId,
      parentId: comment.parentId ?? '',
      content: comment.content,
    })
    setFormMode('edit')
  }

  function openMediation(comment = null) {
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

  async function submit(event) {
    event.preventDefault()
    const payload = {
      userId: form.userId,
      lessonId: form.lessonId,
      parentId: form.parentId || null,
      content: form.content,
    }

    try {
      if (formMode === 'edit') await api.updateComment(selectedComment.id, payload)
      else await api.createComment(payload)
      closeForm()
      await loadData()
    } catch {
      setError('No se pudo guardar el comentario. Revisa usuario, lección y contenido.')
    }
  }

  async function remove() {
    try {
      await api.deleteComment(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el comentario.')
    }
  }

  return (
    <main className="page comments-moderation-page">
      <section className="page-header">
        <span className="eyebrow">Comunidad del curso</span>
        <h1>Comentarios</h1>
        <p>Revisa las conversaciones de las lecciones y agrega respuestas de mediación cuando una duda necesite acompañamiento.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}
      <CommentSummary adminCount={adminUsers.length} commentCount={comments.length} stats={stats} />
      {formMode ? (
        <CommentForm
          adminUsers={adminUsers}
          form={form}
          formMode={formMode}
          lessons={lessons}
          lessonsById={lessonsById}
          modulesById={modulesById}
          onCancel={closeForm}
          onChange={field}
          onSubmit={submit}
          regularUsers={regularUsers}
          selectedLessonContext={selectedLessonContext}
          selectedParent={selectedParent}
        />
      ) : null}
      <CommentList
        comments={filteredComments}
        commentsById={commentsById}
        loading={loading}
        modulesById={modulesById}
        lessonsById={lessonsById}
        onCreate={openUserComment}
        onDelete={setDeleteTarget}
        onEdit={openEditComment}
        onMediate={openMediation}
        onScopeFilterChange={setScopeFilter}
        onSearchChange={(event) => setSearch(event.target.value)}
        scopeFilter={scopeFilter}
        search={search}
        usersById={usersById}
      />
      <CommentDeleteDialog comment={deleteTarget} usersById={usersById} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
    </main>
  )
}
